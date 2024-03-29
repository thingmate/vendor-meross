import { readdir, writeFile } from 'node:fs/promises';
import { join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));

const ROOT_PATH = join(__dirname, '../../../');
const INDEX_PATH = join(ROOT_PATH, 'index.ts');
const SRC_PATH = join(ROOT_PATH, 'src');

const FILE_NAME_REGEXP = new RegExp('^(.*(?<!(?:test|spec|private)))\\.ts$');
const DIRECTORY_NAME_REGEXP = new RegExp('^.*(?<!(?:test|spec|private))$');

function generateIndexFile(
  {
    dry = true,
  },
) {
  const paths = [];

  const explore = (
    path,
  ) => {
    return readdir(path, { withFileTypes: true })
      .then(async (entries) => {
        for (const entry of entries) {
          const subPath = join(path, entry.name);
          const relativePath = relative(ROOT_PATH, subPath);

          if (entry.isFile()) {
            FILE_NAME_REGEXP.lastIndex = 0;
            const match = FILE_NAME_REGEXP.exec(relativePath);
            if (match !== null) {
              paths.push(match[1]);
            }
          } else if (entry.isDirectory()) {
            DIRECTORY_NAME_REGEXP.lastIndex = 0;
            const match = DIRECTORY_NAME_REGEXP.exec(relativePath);
            if (match !== null) {
              await explore(subPath);
            }
          }
        }
      });
  };


  return explore(SRC_PATH)
    .then(() => {
      if (dry) {
        console.log(paths.join('\n'));
      } else {
        return writeFile(
          INDEX_PATH,
          paths
            .map((path) => {
              return `export * from './${ path }';`;
            })
            .join('\n'),
        );
      }
    });
}

const dry = process.argv.includes('--dry');

generateIndexFile({ dry })
  .catch((error) => {
    console.error(error);
  });
