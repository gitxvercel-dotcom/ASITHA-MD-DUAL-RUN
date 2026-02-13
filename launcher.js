const { fork, execSync } = require('child_process');

const path = require('path');

const fs = require('fs');

const BOT_FOLDERS = ['bot1', 'bot2'];

const ENTRY_FILE = 'start.js';

const DELAY_TIME = 60000;

async function startFinalSystem() {

    for (let i = 0; i < BOT_FOLDERS.length; i++) {

        const folder = BOT_FOLDERS[i];

        const folderPath = path.join(__dirname, folder);

        console.log(`\n--- 🛠️  Processing ${folder.toUpperCase()} ---`);

        // 1. Auto-Install Dependencies

        if (!fs.existsSync(path.join(folderPath, 'node_modules'))) {

            console.log(`📦 Installing missing modules in ${folder}...`);

            try {

                execSync('npm install', { cwd: folderPath, stdio: 'inherit' });

            } catch (e) {

                console.error(`❌ Install failed for ${folder}. check package.json exists.`);

                continue;

            }

        }

        // 2. Launch with total isolation

        console.log(`🚀 Launching ${folder} on Port ${8000 + i}...`);

        fork(ENTRY_FILE, [], {

            cwd: folderPath,

            env: { 

                ...process.env, 

                PORT: (8000 + i).toString(),

                NODE_APP_INSTANCE: i.toString() // Helps some bots distinguish instances

            }

        });

        // 3. Wait for the first bot to fully stabilize

        if (i < BOT_FOLDERS.length - 1) {

            console.log(`⏳ Waiting 60s for ${folder} to finish connecting...`);

            await new Promise(res => setTimeout(res, DELAY_TIME));

        }

    }

    console.log(`\n✅ ALL BOTS ARE ONLINE AND ISOLATED.`);

}

startFinalSystem();


        

