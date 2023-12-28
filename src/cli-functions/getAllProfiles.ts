import { Command } from "@tauri-apps/api/shell";


export async function getAllProfiles() {
    try {
        const command = new Command('aws-cli', ["configure", "list-profiles", "--output", "json"]);
        // console.log('command', command)
        command.on('close', data => {
            // console.log(`command finished with code ${data.code} and signal ${data.signal}`);
            if (data.code !== 0) {
                throw new Error(`Command failed with code ${data.code}`);
            }
        });
        command.on('error', error => {
            console.error(`command error: "${error}"`);
            throw error;
        });

        const child = await command.execute();

        // console.log('child', child)

        const childOutput = child.stdout?.toString() || '';
        const cleanedOutput = childOutput.replace(/[\r\n]+/g, '\n');

        const users = cleanedOutput.trim().split('\n');

        return users;
    } catch (error) {
        if (error instanceof Error) {
            return error.message;
        }
    }

}