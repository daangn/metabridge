import exec from "exec-sh";

(async () => {
  const command = [
    "yarn",
    "metabridge-cli",
    "--plugin",
    "@metabridge/plugin-typescript-docs",
    "--schema",
    "./test/schema.json",
    "--output",
    "./test/schema.output.html",
  ].join(" ");

  await exec.promise(command, true);
})();
