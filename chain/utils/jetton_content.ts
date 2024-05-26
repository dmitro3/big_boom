import { beginCell, Cell, Dictionary } from '@ton/core';
import { sha256 } from '@ton/crypto';
import { flattenSnakeCell, makeSnakeCell } from './snake_parse';

export interface JettonContent {
    name: string; // Optional. UTF8 string. The name of the token - e.g. "Example Coin".
    description: string; // Optional. UTF8 string. Describes the token - e.g. "This is an example
    // jetton for the TON network".
    symbol: string; // Optional. UTF8 string. The symbol of the token - e.g. "XMPL". Used in the
    // form "You received 99 XMPL".
    decimals: number; // Optional. If not specified, 9 is used by default. UTF8 encoded string with
    // number from 0 to 255. The number of decimals the token uses - e.g. 8, means to divide the token amount by 100000000 to get its user representation, while 0 means that tokens are indivisible: user representation of token number should correspond to token amount in wallet-contract storage. In case you specify decimals, it is highly recommended that you specify this parameter on-chain and that the smart contract code ensures that this parameter is immutable.
    // image_data: string; // Optional. Either binary representation of the image for onchain layout or
    // base64 for offchain layout.
    image: string;
}

export function st(str: string | number, encode: "utf-8" | "ascii" = "utf-8"): Cell {
    return makeSnakeCell(Buffer.from(str.toString(), encode));
}

export async function toCell(data: JettonContent): Promise<Cell> {
    let dict = Dictionary.empty<Buffer, Cell>();

    dict.set(await sha256("name"), st(data.name));
    dict.set(await sha256("description"), st(data.description));
    dict.set(await sha256("symbol"), st(data.symbol));
    dict.set(await sha256("decimals"), st(data.decimals));
    dict.set(await sha256("image"), st(data.image, "ascii"));

    return beginCell()
        .storeUint(0, 8)
        .storeDict(dict, Dictionary.Keys.Buffer(32), Dictionary.Values.Cell())
        .endCell();
}

/**
 * Убирает из начала строки биты нулевой длины с пустыми значениями \x00
 * @param str
 */
export function normalStr(str: string): string {
    // return str;
    return str.replace(/^[\0]+/, '');
}

async function getString(dict: Dictionary<Buffer, Cell>, name: string): Promise<string> {
    let v = dict.get(await sha256(name));
    if (!v) {
        return "";
    }

    return normalStr(flattenSnakeCell(v).toString("utf-8"));
}

async function getUri(dict: Dictionary<Buffer, Cell>, name: string): Promise<string> {
    let v = dict.get(await sha256(name));
    if (!v) {
        return "";
    }

    return normalStr(flattenSnakeCell(v).toString("ascii"));
}

async function getNumber(dict: Dictionary<Buffer, Cell>, name: string, def: number = NaN): Promise<number> {
    let v = dict.get(await sha256(name));
    if (!v) {
        return def;
    }

    return parseInt(normalStr(flattenSnakeCell(v).toString("ascii")), 10);
}

export async function fromCell(cell: Cell): Promise<{flag: number, content: JettonContent}> {
    let jettonContentSlice = cell.beginParse();
    let dataFlag = jettonContentSlice.loadUint(8);

    let dict = jettonContentSlice.loadDict(Dictionary.Keys.Buffer(32), Dictionary.Values.Cell());

    return {flag: dataFlag, content: {
            name: await getString(dict, "name"),
            description: await getString(dict, "description"),
            symbol: await getString(dict, "symbol"),
            decimals: await getNumber(dict, "decimals"),
            image: await getUri(dict as any, "image"),
        }};
}

export const jettonData: JettonContent = {
    name: "Big Boom",
    description: "Chain Reaction",
    symbol: "BB",
    decimals: 9,
    image: "https://raw.githubusercontent.com/mirosphere/big_boom/main/img/256x256.png"
}
