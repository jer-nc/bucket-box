import { Command } from '@tauri-apps/api/shell';

export async function getBucketContents(bucket: string, profile: string, region: string) {
    try {

        console.log('region', region);
        // Si la región es 'us-east-1', se usa el valor predeterminado
        if (region === null) {
            region = 'us-east-1';
        }

        console.log('region 2', region);

        const command = new Command('aws-cli', ["s3", "ls", 's3://' + bucket + '/', "--region", region, "--output", "json", "--profile", profile]);

        console.log('command', command);
        let errorOutput = '';

        command.stderr.on('data', data => {
            errorOutput += data.toString();
        });

        const child = await command.execute();

        if (child.code !== 0) {
            throw new Error(`Command failed with code ${child.code}. Error: ${errorOutput}`);
        }
        console.log('child', child);

        const str = child.stdout.toString();
        // Dividir las líneas de texto en un array
        const lines = str.trim().split('\n');
        // Aplicar la transformación a cada línea antes de procesarla
        const processedLines = lines.map(line => line.trim().split(/\s+/));

        // Filtrar y mapear las líneas para crear objetos JSON según tu lógica
        const contents = processedLines.map((elements: string[]) => {

            if (elements.length === 2 && elements[0] === 'PRE') {
                // Es un directorio
                return {
                    type: 'folder',
                    name: elements[1].slice(0, -1), // Eliminar la barra diagonal final del nombre del directorio
                    size: null,
                    lastModified: null,
                };
            } else if (elements.length >= 4) {
                // Es un archivo
                const isFile = elements[0].match(/^\d{4}-\d{2}-\d{2}$/) !== null;
                const sizeIndex = isFile ? 2 : 3;
                const lastIndex = elements.length - 1;

                const name = elements.slice(sizeIndex + 1).join(' ');
                const size = isFile ? parseInt(elements[sizeIndex]) : null;

                const dateTimeInfo = elements.slice(0, lastIndex - (isFile ? 1 : 0));
                const lastModified = dateTimeInfo.join(' ');

                return {
                    type: isFile ? 'file' : 'folder',
                    name: isFile ? name : elements[lastIndex],
                    size,
                    lastModified: isFile ? lastModified : null,
                };
            } else {
                // Otro tipo de línea que no corresponde a un archivo ni a un directorio
                return null;
            }
        }).filter(Boolean);

        console.log('contents', contents)

        return contents;

    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error(error.message);
            throw new Error(error.message);
        }
    }
}