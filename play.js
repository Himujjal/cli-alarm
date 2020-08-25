import { exec } from "child_process";

export const runMusic = async () => {
  return new Promise((resolve, reject) =>
    exec(
      "E:\\my_code\\javascript\\projects\\alarm\\play.mp3",
      (err, stdout, stderr) => {
        if (err) {
          reject(err);
        }

        if (stderr) {
          console.log(`stderr: ${stderr}`);
          return;
        }

        resolve(stdout);
      }
    )
  );
};
