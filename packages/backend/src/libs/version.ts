import type { Version } from "./primitives";

export function createVersion(): Version {
  return 1 as Version;
}

export function incVersion(version: Version): Version {
	return (version + 1) as Version;
}

export function compareVersions(a: Version, b: Version): boolean {
	return a === b;
}
