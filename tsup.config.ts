import { defineConfig } from "tsup";
import PackageJson from "./package.json";
import { existsSync } from "node:fs";

export default defineConfig({
  entryPoints: Object.entries(PackageJson.exports)
    .filter(([key]) => key.startsWith("./dev"))
    .map(([, value]) => {
      if (!existsSync(value.import)) throw new Error(`Entry point not found: ${value.import}`);
      return value.import;
    }),
  format: ["esm"],
  dts: true,
  clean: true,
  minify: false,
});
