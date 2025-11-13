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
    mainClass: string;
    dependencies: string[];
    logger: "none" | "tinylog" | "logback" | "simple";
}

const javaVersion = "25";
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
    let code = "";

    code += "plugins {\n";

    if (configuration.language == "java") {
        code += " ".repeat(4) + "id 'java'\n";
    } else if (configuration.language == "kotlin") {
        const resolvedKotlinVersion = resolvedVersions["kotlin"] || "2.2.20";
        code += " ".repeat(4) + `id 'org.jetbrains.kotlin.jvm' version '${resolvedKotlinVersion}'\n`;
    }

    code += " ".repeat(4) + "id 'application'\n";
    code += " ".repeat(4) + `id 'com.gradleup.shadow' version '${shadowVersion}'\n`;
    code += "}\n";

    code += "\n";
    if (configuration.group) code += `group = '${configuration.group}'\n`;
    code += `application.mainClass = '${configuration.mainClass}'\n`;

    if (configuration.language == "java") {
        code += `java.toolchain.languageVersion = JavaLanguageVersion.of(${javaVersion})\n`;
    } else if (configuration.language == "kotlin") {
        code += `kotlin.jvmToolchain(${javaVersion})\n`;
    }

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

    customRepositories.forEach(url => {
        code += " ".repeat(4) + "maven {\n";
        code += " ".repeat(8) + `url '${url}'\n`;
        code += " ".repeat(4) + "}\n";
    });
    code += "}\n";

    code += "\n";
    code += "dependencies {\n";
    const minestomVersion = typeof minestom.version === "function" ? resolvedVersions[minestom.artifact] : minestom.version;
    code += " ".repeat(4) + `implementation '${minestom.group}:${minestom.artifact}:${minestomVersion}'\n`;

    for (const dependency of selectedDependencies) {
        const version = typeof dependency.version === "function" ? resolvedVersions[dependency.artifact] : dependency.version;
        code += " ".repeat(4) + `implementation '${dependency.group}:${dependency.artifact}:${version}'\n`;
    }

    if (configuration.logger === "tinylog") {
        code += " ".repeat(4) + `implementation 'org.tinylog:tinylog-api` + (configuration.language === "kotlin" ? "-kotlin" : "") + `:2.8.0-M1'\n`;
        code += " ".repeat(4) + `implementation 'org.tinylog:tinylog-impl:2.8.0-M1'\n`;
        code += " ".repeat(4) + `implementation 'org.tinylog:slf4j-tinylog:2.8.0-M1'\n`;
    } else if (configuration.logger === "logback") {
        code += " ".repeat(4) + `implementation 'ch.qos.logback:logback-classic:1.5.18'\n`;
    } else if (configuration.logger === "simple") {
        code += " ".repeat(4) + `implementation 'org.slf4j:slf4j-simple:2.0.17'\n`;
    }

    code += "}\n";
    code += "\n";
    code += "tasks.withType(JavaCompile) {\n";
    code += " ".repeat(4) + "options.encoding = 'UTF-8'\n";
    code += "}\n";
    return code;
}

export function generateMavenCode(configuration: Configuration, resolvedVersions: Record<string, string>): string {
    let code = "";

    code += `<?xml version="1.0" encoding="UTF-8"?>\n`;
    code += `<project xmlns="http://maven.apache.org/POM/4.0.0"\n`;
    code += `         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"\n`;
    code += `         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">\n`;
    code += `    <modelVersion>4.0.0</modelVersion>\n`;
    code += `\n`;
    code += `    <groupId>${configuration.group}</groupId>\n`;
    code += `    <artifactId>minestom-server</artifactId>\n`;
    code += `    <version>1.0.0</version>\n`;
    code += `    <packaging>jar</packaging>\n`;
    code += `\n`;
    code += `    <properties>\n`;
    code += `        <maven.compiler.source>${javaVersion}</maven.compiler.source>\n`;
    code += `        <maven.compiler.target>${javaVersion}</maven.compiler.target>\n`;
    code += `        <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>\n`;
    if (configuration.language === "kotlin") {
        const resolvedKotlinVersion = resolvedVersions["kotlin"] || "2.2.20";
        code += `        <kotlin.version>${resolvedKotlinVersion}</kotlin.version>\n`;
    }
    code += `    </properties>\n`;

    const selectedDependencies = configuration.dependencies
        .map(key => optionalDependencies[key])
        .filter((dependency): dependency is Dependency => dependency !== undefined);

    const customRepositories = new Set<string>();

    selectedDependencies.forEach(dependency => {
        if (dependency.repository) {
            customRepositories.add(dependency.repository.url);
        }
    });

    if (customRepositories.size > 0) {
        code += `\n`;
        code += `    <repositories>\n`;
        let repoId = 1;
        customRepositories.forEach(url => {
            code += `        <repository>\n`;
            code += `            <id>custom-repo-${repoId}</id>\n`;
            code += `            <url>${url}</url>\n`;
            code += `        </repository>\n`;
            repoId++;
        });
        code += `    </repositories>\n`;
    }

    code += `\n`;
    code += `    <dependencies>\n`;
    const minestomVersion = typeof minestom.version === "function" ? resolvedVersions[minestom.artifact] : minestom.version;
    code += `        <dependency>\n`;
    code += `            <groupId>${minestom.group}</groupId>\n`;
    code += `            <artifactId>${minestom.artifact}</artifactId>\n`;
    code += `            <version>${minestomVersion}</version>\n`;
    code += `        </dependency>\n`;

    for (const dependency of selectedDependencies) {
        const version = typeof dependency.version === "function" ? resolvedVersions[dependency.artifact] : dependency.version;
        code += `        <dependency>\n`;
        code += `            <groupId>${dependency.group}</groupId>\n`;
        code += `            <artifactId>${dependency.artifact}</artifactId>\n`;
        code += `            <version>${version}</version>\n`;
        code += `        </dependency>\n`;
    }

    if (configuration.logger === "tinylog") {
        code += `        <dependency>\n`;
        code += `            <groupId>org.tinylog</groupId>\n`;
        code += `            <artifactId>tinylog-api` + (configuration.language === "kotlin" ? "-kotlin" : "") + `</artifactId>\n`;
        code += `            <version>2.8.0-M1</version>\n`;
        code += `        </dependency>\n`;
        code += `        <dependency>\n`;
        code += `            <groupId>org.tinylog</groupId>\n`;
        code += `            <artifactId>tinylog-impl</artifactId>\n`;
        code += `            <version>2.8.0-M1</version>\n`;
        code += `        </dependency>\n`;
        code += `        <dependency>\n`;
        code += `            <groupId>org.tinylog</groupId>\n`;
        code += `            <artifactId>slf4j-tinylog</artifactId>\n`;
        code += `            <version>2.8.0-M1</version>\n`;
        code += `        </dependency>\n`;
    } else if (configuration.logger === "logback") {
        code += `        <dependency>\n`;
        code += `            <groupId>ch.qos.logback</groupId>\n`;
        code += `            <artifactId>logback-classic</artifactId>\n`;
        code += `            <version>1.5.18</version>\n`;
        code += `        </dependency>\n`;
    } else if (configuration.logger === "simple") {
        code += `        <dependency>\n`;
        code += `            <groupId>org.slf4j</groupId>\n`;
        code += `            <artifactId>slf4j-simple</artifactId>\n`;
        code += `            <version>2.0.17</version>\n`;
        code += `        </dependency>\n`;
    }

    if (configuration.language === "kotlin") {
        code += `        <dependency>\n`;
        code += `            <groupId>org.jetbrains.kotlin</groupId>\n`;
        code += `            <artifactId>kotlin-stdlib</artifactId>\n`;
        code += `            <version>\${kotlin.version}</version>\n`;
        code += `        </dependency>\n`;
    }

    code += `    </dependencies>\n`;
    code += `\n`;
    code += `    <build>\n`;
    code += `        <plugins>\n`;

    if (configuration.language === "kotlin") {
        code += `            <plugin>\n`;
        code += `                <groupId>org.jetbrains.kotlin</groupId>\n`;
        code += `                <artifactId>kotlin-maven-plugin</artifactId>\n`;
        code += `                <version>\${kotlin.version}</version>\n`;
        code += `                <executions>\n`;
        code += `                    <execution>\n`;
        code += `                        <id>compile</id>\n`;
        code += `                        <goals>\n`;
        code += `                            <goal>compile</goal>\n`;
        code += `                        </goals>\n`;
        code += `                    </execution>\n`;
        code += `                </executions>\n`;
        code += `                <configuration>\n`;
        code += `                    <jvmTarget>${javaVersion}</jvmTarget>\n`;
        code += `                </configuration>\n`;
        code += `            </plugin>\n`;
    }

    code += `            <plugin>\n`;
    code += `                <groupId>org.apache.maven.plugins</groupId>\n`;
    code += `                <artifactId>maven-compiler-plugin</artifactId>\n`;
    code += `                <version>3.13.0</version>\n`;
    code += `            </plugin>\n`;
    code += `            <plugin>\n`;
    code += `                <groupId>org.apache.maven.plugins</groupId>\n`;
    code += `                <artifactId>maven-shade-plugin</artifactId>\n`;
    code += `                <version>3.6.0</version>\n`;
    code += `                <executions>\n`;
    code += `                    <execution>\n`;
    code += `                        <phase>package</phase>\n`;
    code += `                        <goals>\n`;
    code += `                            <goal>shade</goal>\n`;
    code += `                        </goals>\n`;
    code += `                        <configuration>\n`;
    code += `                            <transformers>\n`;
    code += `                                <transformer implementation="org.apache.maven.plugins.shade.resource.ManifestResourceTransformer">\n`;
    code += `                                    <mainClass>${configuration.mainClass}</mainClass>\n`;
    code += `                                </transformer>\n`;
    code += `                            </transformers>\n`;
    code += `                        </configuration>\n`;
    code += `                    </execution>\n`;
    code += `                </executions>\n`;
    code += `            </plugin>\n`;
    code += `        </plugins>\n`;
    code += `    </build>\n`;
    code += `</project>\n`;
    return code;
}