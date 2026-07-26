#!/usr/bin/env bash
# Clone every GitHub repo linked from src/data.ts and print the Minestom
# dependency version found on each of its most recently updated branches.
#
# Usage: scan-libraries.sh [path/to/data.ts] [branches-per-repo]
set -u

DATA="${1:-$(cd "$(dirname "${BASH_SOURCE[0]}")/../../../.." && pwd)/src/data.ts}"
BRANCHES="${2:-8}"
WORK="${SCAN_CACHE:-/tmp/minestom-rocks-libcheck}"
mkdir -p "$WORK"

REPOS=$(grep -v '^[[:space:]]*//' "$DATA" \
    | grep -oE 'https://github\.com/[A-Za-z0-9._-]+/[A-Za-z0-9._-]+' \
    | sed -e 's|https://github\.com/||' -e 's|\.git$||' \
    | grep -E '^[^/]+/[^/]+$' | sort -u)

[ -z "$REPOS" ] && { echo "no github links found in $DATA" >&2; exit 1; }

clone_one() {
    local repo="$1" dir="$WORK/${1#*/}"
    [ -d "$dir" ] && { git -C "$dir" fetch --quiet --all --prune 2>/dev/null; return; }
    git clone --filter=blob:none --quiet "https://github.com/$repo.git" "$dir" 2>/dev/null \
        || echo "CLONE FAILED $repo" >&2
}
export WORK
export -f clone_one

echo "$REPOS" | xargs -P 8 -I{} bash -c 'clone_one "$@"' _ {}

for repo in $REPOS; do
    dir="$WORK/${repo#*/}"
    [ -d "$dir" ] || continue
    default=$(git -C "$dir" symbolic-ref --quiet --short refs/remotes/origin/HEAD 2>/dev/null)
    echo "=============== $repo  (default: ${default:-unknown})"
    for branch in $(git -C "$dir" for-each-ref --format='%(refname:short)' \
                        --sort=-committerdate refs/remotes/origin \
                    | grep -v 'HEAD$' | head -"$BRANCHES"); do
        hits=$(git -C "$dir" grep -h -iE 'minestom' "$branch" -- \
                   '*.gradle' '*.gradle.kts' '*.properties' '*.toml' '*.xml' '*.kt' '*.json' 2>/dev/null \
               | grep -oE '(net\.minestom[^"'"'"']*[:,][^"'"'"']*)|([0-9]{4}\.[0-9]{2}\.[0-9]{2}[a-z]?-[0-9.]+)|(1_21_[0-9]+-[A-Za-z0-9]+)' \
               | grep -oE '([0-9]{4}\.[0-9]{2}\.[0-9]{2}[a-z]?-[0-9.]+)|(1_21_[0-9]+-SNAPSHOT)|([0-9a-f]{10})' \
               | sort -u | tr '\n' ' ')
        marker=""
        [ "$branch" = "$default" ] && marker="  <-- default"
        [ -n "$hits" ] && printf '  %-46s %s  %s%s\n' \
            "$branch" "$(git -C "$dir" log -1 --format=%cs "$branch")" "$hits" "$marker"
    done
done
