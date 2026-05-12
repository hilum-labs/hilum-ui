import { Command } from "commander";
import { addCommand } from "./commands/add.js";
import { listCommand } from "./commands/list.js";

const program = new Command().name("hilum").description("Hilum UI CLI").version("0.1.0");

program.addCommand(addCommand);
program.addCommand(listCommand);

program.parse();
