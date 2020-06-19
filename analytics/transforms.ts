import { Readable, Writable, Transform } from "stream";
import { testData } from "./identitiesTestData";

export {
    UUIDExtractor,
    Count,
    Echo,
    ObjectInput,
    UniqueFilter
}

class UUIDExtractor extends Transform {

    constructor(options) {
        options.objectMode = true;
        super(options);
    }

    _transform(chunk, encoding, callback) {
        this.push(chunk.identity.uuid);
        callback();
    }

}

class Count extends Transform {

    private counts: number;

    constructor(options) {
        super({
            objectMode: true
        });

        this.counts = 0;
    }

    _transform(chunk, encoding, callback) {
        this.counts = this.counts + 1;
        callback();
    }

    _flush(callback) {
        this.push(this.counts);
        callback();
    }

    getNumber(): number {
        return this.counts;
    }
}

class Echo extends Writable {
    
    constructor(options) {
        options.objectMode = true;
        super(options);
    }

    _write(chunk, encoding, callback) {
        console.log(chunk);
        callback();
    }

}

class ObjectInput extends Readable {

    constructor(options) {
        options.objectMode = true;
        super(options);
    }

    _read() {}
}

class UniqueFilter extends Transform {
    private received: Set<string>;

    constructor(options) {
        options.objectMode = true;
        super(options);

        this.received = new Set([]);
    }

    _transform(chunk: string, encoding, callback) {

        if (! this.received.has(chunk)) {
            this.received.add(chunk);
            this.push(chunk);
        }

        callback();
    }

}



async function test() {

    let readable = new ObjectInput({});
    let extractor = new UUIDExtractor({});
    let uniqueFilter = new UniqueFilter({});

    for (let item of testData) {
        readable.push(item);
    }
    readable.push(null);

    let echo = new Echo({});
    let myCounts = new Count({});
    let it = readable.pipe(extractor).pipe(uniqueFilter).pipe(myCounts);

    for await (const v of it) {
        return v;
    }

}

test().then(d => console.log(d)).catch(e => console.log(e));