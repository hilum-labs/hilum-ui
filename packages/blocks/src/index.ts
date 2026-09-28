import { Command } from "commander";
import { addCommand } from "./commands/add.js";
import { listCommand } from "./commands/list.js";
import { cliVersion } from "./lib/version.js";

const program = new Command().name("hilum").description("Hilum UI CLI").version(cliVersion());

program.addCommand(addCommand);
program.addCommand(listCommand);

program.parse();
