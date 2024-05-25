import { beginCell, BitBuilder, BitReader, Cell } from '@ton/core';

function bufferToChunks(buf: Buffer, bytes: number): Array<Buffer> {
    const result: Array<Buffer> = [];
    while (buf.length) {
        let i = Math.min(buf.length, bytes);
        result.push(buf.subarray(0, i));
        buf = buf.subarray(i + 1);
    }
    return result;
}

export function makeSnakeCell(data: Buffer): Cell {
    const chunks = bufferToChunks(data, 127);

    let chunksLength = chunks.length - 1;

    if (chunksLength === -1) {
        return beginCell().endCell()
    }

    if (chunksLength === 0) {
        return beginCell().storeBuffer(chunks[0]).endCell()
    }

    let curCell = beginCell()

    for (let i = chunksLength; i >= 0; i--) {
        const chunk = chunks[i]

        curCell.storeBuffer(chunk)

        if (i - 1 >= 0) {
            const nextCell = beginCell()
            nextCell.storeRef(curCell)
            curCell = nextCell
        }
    }

    return curCell.endCell()
}

export function flattenSnakeCell(cell: Cell): Buffer {
    let c: Cell | null = cell;

    const bitResult = new BitBuilder();
    while (c) {
        const cs = c.beginParse();
        if (cs.remainingBits === 0) {
            break;
        }

        const data = cs.loadBits(cs.remainingBits);
        bitResult.writeBits(data);
        c = c.refs && c.refs[0];
    }

    const endBits = bitResult.build();
    const reader = new BitReader(endBits);

    return reader.loadBuffer(reader.remaining / 8);
}
