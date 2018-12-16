import {Command, flags} from '@oclif/command';
import {Parser} from './parser'
import {Lexer} from './lexer'

class Bsc extends Command {
  static description = 'describe the command here'

  static flags = {
    // add --version flag to show CLI version
    version: flags.version({char: 'v'}),
    help: flags.help({char: 'h'}),
    // flag with a value (-n, --name=VALUE)
    name: flags.string({char: 'n', description: 'name to print'}),
    // flag with no value (-f, --force)
    force: flags.boolean({char: 'f'}),
  }

  static args = [{name: 'file'}]

  async run() {
    const {args, flags} = this.parse(Bsc)
    let parser = new Parser(new Lexer());
    //parser.scanAll("resources/bubble-simple.b");
    parser.parse("resources/bubble-simple.b");
    const name = flags.name || 'world'
    this.log(`hello ${name} from ./src/index.ts`)
    if (args.file && flags.force) {
      this.log(`you input --force and --file: ${args.file}`)
    }
  }
}

export = Bsc
