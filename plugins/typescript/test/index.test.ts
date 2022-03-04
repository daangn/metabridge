import exec from "exec-sh";

(async () => {
  const command = [
    "yarn",
    "nextbridge-cli",
    "--plugin",
    "@nextbridge/plugin-typescript",
    "--schema",
    "./test/schema.json",
    "--output",
    "./test/output",
  ].join(" ");

  console.log(command);

  const { stdout } = await exec.promise(command, true);

  console.log(stdout);
})();
