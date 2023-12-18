import { AWS_CLI_COMMANDS } from "@/lib/aws-commands";
import { Command } from "@tauri-apps/api/shell";


export async function getAllProfiles() {
    try {
        const command = new Command('aws-cli', AWS_CLI_COMMANDS('').AWS_LIST_PROFILES);
        console.log('command', command)
        command.on('close', data => {
            console.log(`command finished with code ${data.code} and signal ${data.signal}`);
            if (data.code !== 0) {
                throw new Error(`Command failed with code ${data.code}`);
            }
        });
        command.on('error', error => {
            console.error(`command error: "${error}"`);
            throw error;
        });

        const child = await command.execute();

        console.log('child', child)

        const childOutput = child.stdout?.toString() || ''; // Obtener la salida del comando
        const cleanedOutput = childOutput.replace(/[\r\n]+/g, '\n'); // Reemplazar múltiples saltos de línea por uno solo (\n)

        const users = cleanedOutput.trim().split('\n');

        console.log('users', users)
        return users;


    } catch (error) {
        console.error(error);
        throw error;
    }


}