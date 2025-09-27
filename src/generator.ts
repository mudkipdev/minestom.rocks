export async function fetchLatestCommit(owner: string, repository: string, branch: string): Promise<string> {
    const response = await fetch(`https://api.github.com/repos/${owner}/${repository}/commits/${branch}`);
    return (await response.json()).sha;
}

export async function fetchLatestRelease(owner: string, repository: string): Promise<string> {
    const response = await fetch(`https://api.github.com/repos/${owner}/${repository}/releases/latest`);
    return (await response.json()).tag_name;
}

export interface Repository {
    url: string;
}

export interface Dependency {
    name: string;
    repository?: Repository;
    group: string;
    artifact: string;
    version: string | (() => Promise<string>);
}

export interface Configuration {
    dsl: "kotlin" | "groovy" | "maven";
    language: "java" | "kotlin";
    group: string;
    version: string;
    mainClass: string;
    dependencies: string[];
    logger: "none" | "tinylog" | "logback" | "simple";
}

const javaVersion = "21";
const shadowVersion = "9.2.1";

export const minestom: Dependency = {
    name: "Minestom",
    group: "net.minestom",
    artifact: "minestom",
    version: () => fetchLatestRelease("Minestom", "Minestom")
};

export const optionalDependencies: Record<string, Dependency> = {
    pvp: {
        name: "MinestomPvP",
        repository: {
            url: "https://jitpack.io"
        },
        group: "com.github.ToGar2",
        artifact: "MinestomPvP",
        version: async () => (await fetchLatestCommit("ToGar2", "MinestomPvP", "master")).substring(0, 10),
    },
    polar: {
        name: "Polar",
        group: "dev.hollowcube",
        artifact: "polar",
        version: () => fetchLatestRelease("hollow-cube", "polar")
    },
    schem: {
        name: "Schem",
        group: "dev.hollowcube",
        artifact: "schem",
        version: () => fetchLatestRelease("hollow-cube", "schem")
    }
};

export function generateKotlinCode(configuration: Configuration, resolvedVersions: Record<string, string>): string {
    let code = "";

    // Plugins
    code += "plugins {\n";

    if (configuration.language == "java") {
        code += " ".repeat(4) + "java\n";
    } else if (configuration.language == "kotlin") {
        const resolvedKotlinVersion = resolvedVersions["kotlin"] || "2.2.20";
        code += " ".repeat(4) + `kotlin("jvm") version "${resolvedKotlinVersion}"\n`;
    }

    code += " ".repeat(4) + "application\n";
    code += " ".repeat(4) + `id("com.gradleup.shadow") version "${shadowVersion}"\n`;
    code += "}\n";

    // Configuration
    code += "\n";
    if (configuration.group) code += `group = "${configuration.group}"\n`;
    if (configuration.version) code += `version = "${configuration.version}"\n`;
    code += `application.mainClass = "${configuration.mainClass}"\n`;

    if (configuration.language == "java") {
        code += `java.toolchain.languageVersion = JavaLanguageVersion.of(${javaVersion})\n`;
    } else if (configuration.language == "kotlin") {
        code += `kotlin.jvmToolchain(${javaVersion})\n`;
    }

    // Repositories
    code += "\n";
    code += "repositories {\n";
    code += " ".repeat(4) + "mavenCentral()\n";

    const selectedDependencies = configuration.dependencies
        .map(key => optionalDependencies[key])
        .filter((dependency): dependency is Dependency => dependency !== undefined);

    const customRepositories = new Set<string>();

    selectedDependencies.forEach(dependency => {
        if (dependency.repository) {
            customRepositories.add(dependency.repository.url);
        }
    });

    customRepositories.forEach(url => code += " ".repeat(4) + `maven("${url}")\n`);
    code += "}\n";

    // Dependencies
    code += "\n";
    code += "dependencies {\n";
    const minestomVersion = typeof minestom.version === "function" ? resolvedVersions[minestom.artifact] : minestom.version;
    code += " ".repeat(4) + `implementation("${minestom.group}:${minestom.artifact}:${minestomVersion}")\n`;

    for (const dependency of selectedDependencies) {
        const version = typeof dependency.version === "function" ? resolvedVersions[dependency.artifact] : dependency.version;
        code += " ".repeat(4) + `implementation("${dependency.group}:${dependency.artifact}:${version}")\n`;
    }

    // Logging
    if (configuration.logger === "tinylog") {
        code += " ".repeat(4) + `implementation("org.tinylog:tinylog-api` + (configuration.language === "kotlin" ? "-kotlin" : "") + `:2.8.0-M1")\n`;
        code += " ".repeat(4) + `implementation("org.tinylog:tinylog-impl:2.8.0-M1")\n`;
        code += " ".repeat(4) + `implementation("org.tinylog:slf4j-tinylog:2.8.0-M1")\n`;
    } else if (configuration.logger === "logback") {
        code += " ".repeat(4) + `implementation("ch.qos.logback:logback-classic:1.5.18")\n`;
    } else if (configuration.logger === "simple") {
        code += " ".repeat(4) + `implementation("org.slf4j:slf4j-simple:2.0.17")\n`;
    }

    code += "}\n";
    code += "\n";
    code += "tasks.withType<JavaCompile> {\n";
    code += " ".repeat(4) + "options.encoding = \"UTF-8\"\n";
    code += "}\n";
    return code;
}

export function generateGroovyCode(configuration: Configuration, resolvedVersions: Record<string, string>): string {
    return "Gradle (Groovy) support is coming soon";
}

export function generateMavenCode(configuration: Configuration, resolvedVersions: Record<string, string>): string {
    return "Maven support is coming soon";
}