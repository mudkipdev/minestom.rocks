#!/usr/bin/env python3
"""Ping every server listed in src/data.ts and report the Minecraft version it advertises.

Usage:
    python3 ping-servers.py [path/to/data.ts] [--address host ...]

Prints one row per server: listed name, listed version, reported version name,
reported protocol number, and the version that protocol maps to.
"""

import argparse
import json
import re
import socket
import struct
import subprocess
import sys
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path

DEFAULT_DATA = Path(__file__).resolve().parents[4] / "src" / "data.ts"
PROTOCOL_MAP = Path(__file__).resolve().parent.parent / "reference" / "protocol-versions.json"


def encode_varint(value):
    value &= 0xFFFFFFFF
    out = b""
    while True:
        byte = value & 0x7F
        value >>= 7
        if value:
            out += bytes([byte | 0x80])
        else:
            return out + bytes([byte])


def read_varint(sock):
    result = 0
    for index in range(5):
        byte = sock.recv(1)
        if not byte:
            raise IOError("connection closed while reading varint")
        result |= (byte[0] & 0x7F) << (7 * index)
        if not byte[0] & 0x80:
            break
    return result


def resolve_srv(host):
    try:
        output = subprocess.run(
            ["dig", "+short", "SRV", f"_minecraft._tcp.{host}"],
            capture_output=True, text=True, timeout=10,
        ).stdout.strip()
        if output:
            fields = output.splitlines()[0].split()
            return fields[3].rstrip("."), int(fields[2])
    except Exception:
        pass
    return host, 25565


def ping(address, protocol=-1, timeout=8):
    host, port = resolve_srv(address)
    sock = socket.create_connection((host, port), timeout=timeout)
    sock.settimeout(timeout)
    try:
        handshake = (
            encode_varint(0x00) + encode_varint(protocol)
            + encode_varint(len(host.encode())) + host.encode()
            + struct.pack(">H", port) + encode_varint(1)
        )
        sock.sendall(encode_varint(len(handshake)) + handshake)
        sock.sendall(encode_varint(1) + encode_varint(0x00))

        read_varint(sock)
        read_varint(sock)
        length = read_varint(sock)

        payload = b""
        while len(payload) < length:
            chunk = sock.recv(length - len(payload))
            if not chunk:
                break
            payload += chunk
    finally:
        sock.close()
    return json.loads(payload.decode("utf-8", "replace"))


def parse_servers(data_path):
    source = Path(data_path).read_text()
    source = re.sub(r"/\*.*?\*/", "", source, flags=re.S)
    source = "\n".join(l for l in source.splitlines() if not l.strip().startswith("//"))

    servers = []
    for block in re.findall(r"\{[^{}]*\}", source):
        fields = dict(re.findall(r'(\w+):\s*(?:discord\()?"([^"]+)"', block))
        if "ip" in fields:
            servers.append((fields.get("name", "?"), fields["ip"], fields.get("version", "-")))
    return servers


def load_protocol_map():
    try:
        return {int(k): v for k, v in json.loads(PROTOCOL_MAP.read_text()).items()}
    except Exception:
        return {}


def check(entry, protocol=-1):
    name, address, listed = entry
    try:
        status = ping(address, protocol)
        version = status.get("version", {})
        return name, address, listed, version.get("name"), version.get("protocol")
    except Exception as error:
        return name, address, listed, f"DOWN: {type(error).__name__}", None


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("data", nargs="?", default=str(DEFAULT_DATA))
    parser.add_argument("--address", action="append", default=[])
    parser.add_argument("--protocol", type=int, default=-1)
    options = parser.parse_args()

    if options.address:
        entries = [("(manual)", a, "-") for a in options.address]
    else:
        entries = parse_servers(options.data)
        if not entries:
            sys.exit(f"no servers with an ip field found in {options.data}")

    protocol_map = load_protocol_map()
    print(f"{'server':22} {'listed':9} {'reported name':26} {'proto':>6}  from protocol")
    print("-" * 88)

    with ThreadPoolExecutor(max_workers=12) as pool:
        results = pool.map(lambda e: check(e, options.protocol), entries)
        for name, address, listed, reported, protocol in results:
            echoed = protocol == options.protocol and options.protocol > 0
            mapped = "" if not protocol or protocol < 0 else \
                "(echoed, ignore)" if echoed else protocol_map.get(protocol, "?")
            if isinstance(mapped, list):
                mapped = " or ".join(mapped)
            print(f"{name[:22]:22} {listed:9} {str(reported)[:26]:26} {str(protocol or ''):>6}  {mapped}")


if __name__ == "__main__":
    main()
