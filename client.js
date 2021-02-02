const main = () => {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    const getCommand = () => {
        rl.question("> ", function(command) {
            processCommand(command)
            getCommand();
        });
    }

    const processCommand = (command) => {

        var args = command.split(' ');
        command = args[0];
        // console.log(args, command);
        var output = '';

        switch (command) {
            case 'get':
                {
                    output = get(args[1]);
                    break;
                }
            case 'set':
                {
                    output = set(args[1], args[2], args.slice(3));
                    break;
                }
            case 'del':
                {
                    output = del(args.slice(1));
                    break;
                }
            case 'keys':
                {
                    output = keys('');
                    break;
                }
        }
        console.log(output);
    }

    getCommand();

    rl.on("close", function() {
        console.log("\nBYE BYE !!!");
        process.exit(0);
    });
}