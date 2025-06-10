import { exec } from "child_process";

exec("python --version", (error, stdout, stderr) => {
  if (error) {
    console.error(`Error ejecutando Python: ${error.message}`);
    return;
  }
  if (stderr) {
    console.warn(`stderr: ${stderr}`);
    return;
  }
  console.log(`Python está instalado: ${stdout}`);
});
