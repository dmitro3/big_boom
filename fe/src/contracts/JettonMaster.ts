// @ts-nocheck
import {
    Cell,
    Slice, 
    Address, 
    Builder, 
    beginCell, 
    ComputeError, 
    TupleItem, 
    TupleReader, 
    Dictionary, 
    contractAddress, 
    ContractProvider, 
    Sender, 
    Contract, 
    ContractABI, 
    ABIType,
    ABIGetter,
    ABIReceiver,
    TupleBuilder,
    DictionaryValue
} from '@ton/core';

export type StateInit = {
    $$type: 'StateInit';
    code: Cell;
    data: Cell;
}

export function storeStateInit(src: StateInit) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeRef(src.code);
        b_0.storeRef(src.data);
    };
}

export function loadStateInit(slice: Slice) {
    let sc_0 = slice;
    let _code = sc_0.loadRef();
    let _data = sc_0.loadRef();
    return { $$type: 'StateInit' as const, code: _code, data: _data };
}

function loadTupleStateInit(source: TupleReader) {
    let _code = source.readCell();
    let _data = source.readCell();
    return { $$type: 'StateInit' as const, code: _code, data: _data };
}

function storeTupleStateInit(source: StateInit) {
    let builder = new TupleBuilder();
    builder.writeCell(source.code);
    builder.writeCell(source.data);
    return builder.build();
}

function dictValueParserStateInit(): DictionaryValue<StateInit> {
    return {
        serialize: (src, buidler) => {
            buidler.storeRef(beginCell().store(storeStateInit(src)).endCell());
        },
        parse: (src) => {
            return loadStateInit(src.loadRef().beginParse());
        }
    }
}

export type Context = {
    $$type: 'Context';
    bounced: boolean;
    sender: Address;
    value: bigint;
    raw: Cell;
}

export function storeContext(src: Context) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeBit(src.bounced);
        b_0.storeAddress(src.sender);
        b_0.storeInt(src.value, 257);
        b_0.storeRef(src.raw);
    };
}

export function loadContext(slice: Slice) {
    let sc_0 = slice;
    let _bounced = sc_0.loadBit();
    let _sender = sc_0.loadAddress();
    let _value = sc_0.loadIntBig(257);
    let _raw = sc_0.loadRef();
    return { $$type: 'Context' as const, bounced: _bounced, sender: _sender, value: _value, raw: _raw };
}

function loadTupleContext(source: TupleReader) {
    let _bounced = source.readBoolean();
    let _sender = source.readAddress();
    let _value = source.readBigNumber();
    let _raw = source.readCell();
    return { $$type: 'Context' as const, bounced: _bounced, sender: _sender, value: _value, raw: _raw };
}

function storeTupleContext(source: Context) {
    let builder = new TupleBuilder();
    builder.writeBoolean(source.bounced);
    builder.writeAddress(source.sender);
    builder.writeNumber(source.value);
    builder.writeSlice(source.raw);
    return builder.build();
}

function dictValueParserContext(): DictionaryValue<Context> {
    return {
        serialize: (src, buidler) => {
            buidler.storeRef(beginCell().store(storeContext(src)).endCell());
        },
        parse: (src) => {
            return loadContext(src.loadRef().beginParse());
        }
    }
}

export type SendParameters = {
    $$type: 'SendParameters';
    bounce: boolean;
    to: Address;
    value: bigint;
    mode: bigint;
    body: Cell | null;
    code: Cell | null;
    data: Cell | null;
}

export function storeSendParameters(src: SendParameters) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeBit(src.bounce);
        b_0.storeAddress(src.to);
        b_0.storeInt(src.value, 257);
        b_0.storeInt(src.mode, 257);
        if (src.body !== null && src.body !== undefined) { b_0.storeBit(true).storeRef(src.body); } else { b_0.storeBit(false); }
        if (src.code !== null && src.code !== undefined) { b_0.storeBit(true).storeRef(src.code); } else { b_0.storeBit(false); }
        if (src.data !== null && src.data !== undefined) { b_0.storeBit(true).storeRef(src.data); } else { b_0.storeBit(false); }
    };
}

export function loadSendParameters(slice: Slice) {
    let sc_0 = slice;
    let _bounce = sc_0.loadBit();
    let _to = sc_0.loadAddress();
    let _value = sc_0.loadIntBig(257);
    let _mode = sc_0.loadIntBig(257);
    let _body = sc_0.loadBit() ? sc_0.loadRef() : null;
    let _code = sc_0.loadBit() ? sc_0.loadRef() : null;
    let _data = sc_0.loadBit() ? sc_0.loadRef() : null;
    return { $$type: 'SendParameters' as const, bounce: _bounce, to: _to, value: _value, mode: _mode, body: _body, code: _code, data: _data };
}

function loadTupleSendParameters(source: TupleReader) {
    let _bounce = source.readBoolean();
    let _to = source.readAddress();
    let _value = source.readBigNumber();
    let _mode = source.readBigNumber();
    let _body = source.readCellOpt();
    let _code = source.readCellOpt();
    let _data = source.readCellOpt();
    return { $$type: 'SendParameters' as const, bounce: _bounce, to: _to, value: _value, mode: _mode, body: _body, code: _code, data: _data };
}

function storeTupleSendParameters(source: SendParameters) {
    let builder = new TupleBuilder();
    builder.writeBoolean(source.bounce);
    builder.writeAddress(source.to);
    builder.writeNumber(source.value);
    builder.writeNumber(source.mode);
    builder.writeCell(source.body);
    builder.writeCell(source.code);
    builder.writeCell(source.data);
    return builder.build();
}

function dictValueParserSendParameters(): DictionaryValue<SendParameters> {
    return {
        serialize: (src, buidler) => {
            buidler.storeRef(beginCell().store(storeSendParameters(src)).endCell());
        },
        parse: (src) => {
            return loadSendParameters(src.loadRef().beginParse());
        }
    }
}

export type Deploy = {
    $$type: 'Deploy';
    queryId: bigint;
}

export function storeDeploy(src: Deploy) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeUint(2490013878, 32);
        b_0.storeUint(src.queryId, 64);
    };
}

export function loadDeploy(slice: Slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 2490013878) { throw Error('Invalid prefix'); }
    let _queryId = sc_0.loadUintBig(64);
    return { $$type: 'Deploy' as const, queryId: _queryId };
}

function loadTupleDeploy(source: TupleReader) {
    let _queryId = source.readBigNumber();
    return { $$type: 'Deploy' as const, queryId: _queryId };
}

function storeTupleDeploy(source: Deploy) {
    let builder = new TupleBuilder();
    builder.writeNumber(source.queryId);
    return builder.build();
}

function dictValueParserDeploy(): DictionaryValue<Deploy> {
    return {
        serialize: (src, buidler) => {
            buidler.storeRef(beginCell().store(storeDeploy(src)).endCell());
        },
        parse: (src) => {
            return loadDeploy(src.loadRef().beginParse());
        }
    }
}

export type DeployOk = {
    $$type: 'DeployOk';
    queryId: bigint;
}

export function storeDeployOk(src: DeployOk) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeUint(2952335191, 32);
        b_0.storeUint(src.queryId, 64);
    };
}

export function loadDeployOk(slice: Slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 2952335191) { throw Error('Invalid prefix'); }
    let _queryId = sc_0.loadUintBig(64);
    return { $$type: 'DeployOk' as const, queryId: _queryId };
}

function loadTupleDeployOk(source: TupleReader) {
    let _queryId = source.readBigNumber();
    return { $$type: 'DeployOk' as const, queryId: _queryId };
}

function storeTupleDeployOk(source: DeployOk) {
    let builder = new TupleBuilder();
    builder.writeNumber(source.queryId);
    return builder.build();
}

function dictValueParserDeployOk(): DictionaryValue<DeployOk> {
    return {
        serialize: (src, buidler) => {
            buidler.storeRef(beginCell().store(storeDeployOk(src)).endCell());
        },
        parse: (src) => {
            return loadDeployOk(src.loadRef().beginParse());
        }
    }
}

export type FactoryDeploy = {
    $$type: 'FactoryDeploy';
    queryId: bigint;
    cashback: Address;
}

export function storeFactoryDeploy(src: FactoryDeploy) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeUint(1829761339, 32);
        b_0.storeUint(src.queryId, 64);
        b_0.storeAddress(src.cashback);
    };
}

export function loadFactoryDeploy(slice: Slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 1829761339) { throw Error('Invalid prefix'); }
    let _queryId = sc_0.loadUintBig(64);
    let _cashback = sc_0.loadAddress();
    return { $$type: 'FactoryDeploy' as const, queryId: _queryId, cashback: _cashback };
}

function loadTupleFactoryDeploy(source: TupleReader) {
    let _queryId = source.readBigNumber();
    let _cashback = source.readAddress();
    return { $$type: 'FactoryDeploy' as const, queryId: _queryId, cashback: _cashback };
}

function storeTupleFactoryDeploy(source: FactoryDeploy) {
    let builder = new TupleBuilder();
    builder.writeNumber(source.queryId);
    builder.writeAddress(source.cashback);
    return builder.build();
}

function dictValueParserFactoryDeploy(): DictionaryValue<FactoryDeploy> {
    return {
        serialize: (src, buidler) => {
            buidler.storeRef(beginCell().store(storeFactoryDeploy(src)).endCell());
        },
        parse: (src) => {
            return loadFactoryDeploy(src.loadRef().beginParse());
        }
    }
}

export type GroupCreating = {
    $$type: 'GroupCreating';
    query_id: bigint;
}

export function storeGroupCreating(src: GroupCreating) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeUint(3000929908, 32);
        b_0.storeUint(src.query_id, 64);
    };
}

export function loadGroupCreating(slice: Slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 3000929908) { throw Error('Invalid prefix'); }
    let _query_id = sc_0.loadUintBig(64);
    return { $$type: 'GroupCreating' as const, query_id: _query_id };
}

function loadTupleGroupCreating(source: TupleReader) {
    let _query_id = source.readBigNumber();
    return { $$type: 'GroupCreating' as const, query_id: _query_id };
}

function storeTupleGroupCreating(source: GroupCreating) {
    let builder = new TupleBuilder();
    builder.writeNumber(source.query_id);
    return builder.build();
}

function dictValueParserGroupCreating(): DictionaryValue<GroupCreating> {
    return {
        serialize: (src, buidler) => {
            buidler.storeRef(beginCell().store(storeGroupCreating(src)).endCell());
        },
        parse: (src) => {
            return loadGroupCreating(src.loadRef().beginParse());
        }
    }
}

export type TokenBurnNotification = {
    $$type: 'TokenBurnNotification';
    query_id: bigint;
    amount: bigint;
    owner: Address;
    response_destination: Address | null;
}

export function storeTokenBurnNotification(src: TokenBurnNotification) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeUint(2078119902, 32);
        b_0.storeUint(src.query_id, 64);
        b_0.storeCoins(src.amount);
        b_0.storeAddress(src.owner);
        b_0.storeAddress(src.response_destination);
    };
}

export function loadTokenBurnNotification(slice: Slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 2078119902) { throw Error('Invalid prefix'); }
    let _query_id = sc_0.loadUintBig(64);
    let _amount = sc_0.loadCoins();
    let _owner = sc_0.loadAddress();
    let _response_destination = sc_0.loadMaybeAddress();
    return { $$type: 'TokenBurnNotification' as const, query_id: _query_id, amount: _amount, owner: _owner, response_destination: _response_destination };
}

function loadTupleTokenBurnNotification(source: TupleReader) {
    let _query_id = source.readBigNumber();
    let _amount = source.readBigNumber();
    let _owner = source.readAddress();
    let _response_destination = source.readAddressOpt();
    return { $$type: 'TokenBurnNotification' as const, query_id: _query_id, amount: _amount, owner: _owner, response_destination: _response_destination };
}

function storeTupleTokenBurnNotification(source: TokenBurnNotification) {
    let builder = new TupleBuilder();
    builder.writeNumber(source.query_id);
    builder.writeNumber(source.amount);
    builder.writeAddress(source.owner);
    builder.writeAddress(source.response_destination);
    return builder.build();
}

function dictValueParserTokenBurnNotification(): DictionaryValue<TokenBurnNotification> {
    return {
        serialize: (src, buidler) => {
            buidler.storeRef(beginCell().store(storeTokenBurnNotification(src)).endCell());
        },
        parse: (src) => {
            return loadTokenBurnNotification(src.loadRef().beginParse());
        }
    }
}

export type TokenExcesses = {
    $$type: 'TokenExcesses';
    query_id: bigint;
}

export function storeTokenExcesses(src: TokenExcesses) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeUint(3576854235, 32);
        b_0.storeUint(src.query_id, 64);
    };
}

export function loadTokenExcesses(slice: Slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 3576854235) { throw Error('Invalid prefix'); }
    let _query_id = sc_0.loadUintBig(64);
    return { $$type: 'TokenExcesses' as const, query_id: _query_id };
}

function loadTupleTokenExcesses(source: TupleReader) {
    let _query_id = source.readBigNumber();
    return { $$type: 'TokenExcesses' as const, query_id: _query_id };
}

function storeTupleTokenExcesses(source: TokenExcesses) {
    let builder = new TupleBuilder();
    builder.writeNumber(source.query_id);
    return builder.build();
}

function dictValueParserTokenExcesses(): DictionaryValue<TokenExcesses> {
    return {
        serialize: (src, buidler) => {
            buidler.storeRef(beginCell().store(storeTokenExcesses(src)).endCell());
        },
        parse: (src) => {
            return loadTokenExcesses(src.loadRef().beginParse());
        }
    }
}

export type TokenTransferInternal = {
    $$type: 'TokenTransferInternal';
    query_id: bigint;
    amount: bigint;
    from: Address;
    response_destination: Address;
    forward_ton_amount: bigint;
    forward_payload: Address | null;
}

export function storeTokenTransferInternal(src: TokenTransferInternal) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeUint(395134233, 32);
        b_0.storeUint(src.query_id, 64);
        b_0.storeCoins(src.amount);
        b_0.storeAddress(src.from);
        b_0.storeAddress(src.response_destination);
        b_0.storeCoins(src.forward_ton_amount);
        let b_1 = new Builder();
        b_1.storeAddress(src.forward_payload);
        b_0.storeRef(b_1.endCell());
    };
}

export function loadTokenTransferInternal(slice: Slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 395134233) { throw Error('Invalid prefix'); }
    let _query_id = sc_0.loadUintBig(64);
    let _amount = sc_0.loadCoins();
    let _from = sc_0.loadAddress();
    let _response_destination = sc_0.loadAddress();
    let _forward_ton_amount = sc_0.loadCoins();
    let sc_1 = sc_0.loadRef().beginParse();
    let _forward_payload = sc_1.loadMaybeAddress();
    return { $$type: 'TokenTransferInternal' as const, query_id: _query_id, amount: _amount, from: _from, response_destination: _response_destination, forward_ton_amount: _forward_ton_amount, forward_payload: _forward_payload };
}

function loadTupleTokenTransferInternal(source: TupleReader) {
    let _query_id = source.readBigNumber();
    let _amount = source.readBigNumber();
    let _from = source.readAddress();
    let _response_destination = source.readAddress();
    let _forward_ton_amount = source.readBigNumber();
    let _forward_payload = source.readAddressOpt();
    return { $$type: 'TokenTransferInternal' as const, query_id: _query_id, amount: _amount, from: _from, response_destination: _response_destination, forward_ton_amount: _forward_ton_amount, forward_payload: _forward_payload };
}

function storeTupleTokenTransferInternal(source: TokenTransferInternal) {
    let builder = new TupleBuilder();
    builder.writeNumber(source.query_id);
    builder.writeNumber(source.amount);
    builder.writeAddress(source.from);
    builder.writeAddress(source.response_destination);
    builder.writeNumber(source.forward_ton_amount);
    builder.writeAddress(source.forward_payload);
    return builder.build();
}

function dictValueParserTokenTransferInternal(): DictionaryValue<TokenTransferInternal> {
    return {
        serialize: (src, buidler) => {
            buidler.storeRef(beginCell().store(storeTokenTransferInternal(src)).endCell());
        },
        parse: (src) => {
            return loadTokenTransferInternal(src.loadRef().beginParse());
        }
    }
}

export type AddToGroup = {
    $$type: 'AddToGroup';
    query_id: bigint;
    from: Address;
    member: Address;
}

export function storeAddToGroup(src: AddToGroup) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeUint(20657543, 32);
        b_0.storeUint(src.query_id, 64);
        b_0.storeAddress(src.from);
        b_0.storeAddress(src.member);
    };
}

export function loadAddToGroup(slice: Slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 20657543) { throw Error('Invalid prefix'); }
    let _query_id = sc_0.loadUintBig(64);
    let _from = sc_0.loadAddress();
    let _member = sc_0.loadAddress();
    return { $$type: 'AddToGroup' as const, query_id: _query_id, from: _from, member: _member };
}

function loadTupleAddToGroup(source: TupleReader) {
    let _query_id = source.readBigNumber();
    let _from = source.readAddress();
    let _member = source.readAddress();
    return { $$type: 'AddToGroup' as const, query_id: _query_id, from: _from, member: _member };
}

function storeTupleAddToGroup(source: AddToGroup) {
    let builder = new TupleBuilder();
    builder.writeNumber(source.query_id);
    builder.writeAddress(source.from);
    builder.writeAddress(source.member);
    return builder.build();
}

function dictValueParserAddToGroup(): DictionaryValue<AddToGroup> {
    return {
        serialize: (src, buidler) => {
            buidler.storeRef(beginCell().store(storeAddToGroup(src)).endCell());
        },
        parse: (src) => {
            return loadAddToGroup(src.loadRef().beginParse());
        }
    }
}

export type TokenBurn = {
    $$type: 'TokenBurn';
    query_id: bigint;
    amount: bigint;
    owner: Address;
    response_destination: Address;
}

export function storeTokenBurn(src: TokenBurn) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeUint(1499400124, 32);
        b_0.storeUint(src.query_id, 64);
        b_0.storeCoins(src.amount);
        b_0.storeAddress(src.owner);
        b_0.storeAddress(src.response_destination);
    };
}

export function loadTokenBurn(slice: Slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 1499400124) { throw Error('Invalid prefix'); }
    let _query_id = sc_0.loadUintBig(64);
    let _amount = sc_0.loadCoins();
    let _owner = sc_0.loadAddress();
    let _response_destination = sc_0.loadAddress();
    return { $$type: 'TokenBurn' as const, query_id: _query_id, amount: _amount, owner: _owner, response_destination: _response_destination };
}

function loadTupleTokenBurn(source: TupleReader) {
    let _query_id = source.readBigNumber();
    let _amount = source.readBigNumber();
    let _owner = source.readAddress();
    let _response_destination = source.readAddress();
    return { $$type: 'TokenBurn' as const, query_id: _query_id, amount: _amount, owner: _owner, response_destination: _response_destination };
}

function storeTupleTokenBurn(source: TokenBurn) {
    let builder = new TupleBuilder();
    builder.writeNumber(source.query_id);
    builder.writeNumber(source.amount);
    builder.writeAddress(source.owner);
    builder.writeAddress(source.response_destination);
    return builder.build();
}

function dictValueParserTokenBurn(): DictionaryValue<TokenBurn> {
    return {
        serialize: (src, buidler) => {
            buidler.storeRef(beginCell().store(storeTokenBurn(src)).endCell());
        },
        parse: (src) => {
            return loadTokenBurn(src.loadRef().beginParse());
        }
    }
}

export type TokenTransfer = {
    $$type: 'TokenTransfer';
    query_id: bigint;
    amount: bigint;
    destination: Address;
    response_destination: Address;
    custom_payload: Cell | null;
    forward_ton_amount: bigint;
    forward_payload: Address;
}

export function storeTokenTransfer(src: TokenTransfer) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeUint(260734629, 32);
        b_0.storeUint(src.query_id, 64);
        b_0.storeCoins(src.amount);
        b_0.storeAddress(src.destination);
        b_0.storeAddress(src.response_destination);
        if (src.custom_payload !== null && src.custom_payload !== undefined) { b_0.storeBit(true).storeRef(src.custom_payload); } else { b_0.storeBit(false); }
        b_0.storeCoins(src.forward_ton_amount);
        let b_1 = new Builder();
        b_1.storeAddress(src.forward_payload);
        b_0.storeRef(b_1.endCell());
    };
}

export function loadTokenTransfer(slice: Slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 260734629) { throw Error('Invalid prefix'); }
    let _query_id = sc_0.loadUintBig(64);
    let _amount = sc_0.loadCoins();
    let _destination = sc_0.loadAddress();
    let _response_destination = sc_0.loadAddress();
    let _custom_payload = sc_0.loadBit() ? sc_0.loadRef() : null;
    let _forward_ton_amount = sc_0.loadCoins();
    let sc_1 = sc_0.loadRef().beginParse();
    let _forward_payload = sc_1.loadAddress();
    return { $$type: 'TokenTransfer' as const, query_id: _query_id, amount: _amount, destination: _destination, response_destination: _response_destination, custom_payload: _custom_payload, forward_ton_amount: _forward_ton_amount, forward_payload: _forward_payload };
}

function loadTupleTokenTransfer(source: TupleReader) {
    let _query_id = source.readBigNumber();
    let _amount = source.readBigNumber();
    let _destination = source.readAddress();
    let _response_destination = source.readAddress();
    let _custom_payload = source.readCellOpt();
    let _forward_ton_amount = source.readBigNumber();
    let _forward_payload = source.readAddress();
    return { $$type: 'TokenTransfer' as const, query_id: _query_id, amount: _amount, destination: _destination, response_destination: _response_destination, custom_payload: _custom_payload, forward_ton_amount: _forward_ton_amount, forward_payload: _forward_payload };
}

function storeTupleTokenTransfer(source: TokenTransfer) {
    let builder = new TupleBuilder();
    builder.writeNumber(source.query_id);
    builder.writeNumber(source.amount);
    builder.writeAddress(source.destination);
    builder.writeAddress(source.response_destination);
    builder.writeCell(source.custom_payload);
    builder.writeNumber(source.forward_ton_amount);
    builder.writeAddress(source.forward_payload);
    return builder.build();
}

function dictValueParserTokenTransfer(): DictionaryValue<TokenTransfer> {
    return {
        serialize: (src, buidler) => {
            buidler.storeRef(beginCell().store(storeTokenTransfer(src)).endCell());
        },
        parse: (src) => {
            return loadTokenTransfer(src.loadRef().beginParse());
        }
    }
}

export type JettonGroupData = {
    $$type: 'JettonGroupData';
    jetton_wallet_code: Cell;
    jetton: Address;
    owner: Address;
}

export function storeJettonGroupData(src: JettonGroupData) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeRef(src.jetton_wallet_code);
        b_0.storeAddress(src.jetton);
        b_0.storeAddress(src.owner);
    };
}

export function loadJettonGroupData(slice: Slice) {
    let sc_0 = slice;
    let _jetton_wallet_code = sc_0.loadRef();
    let _jetton = sc_0.loadAddress();
    let _owner = sc_0.loadAddress();
    return { $$type: 'JettonGroupData' as const, jetton_wallet_code: _jetton_wallet_code, jetton: _jetton, owner: _owner };
}

function loadTupleJettonGroupData(source: TupleReader) {
    let _jetton_wallet_code = source.readCell();
    let _jetton = source.readAddress();
    let _owner = source.readAddress();
    return { $$type: 'JettonGroupData' as const, jetton_wallet_code: _jetton_wallet_code, jetton: _jetton, owner: _owner };
}

function storeTupleJettonGroupData(source: JettonGroupData) {
    let builder = new TupleBuilder();
    builder.writeCell(source.jetton_wallet_code);
    builder.writeAddress(source.jetton);
    builder.writeAddress(source.owner);
    return builder.build();
}

function dictValueParserJettonGroupData(): DictionaryValue<JettonGroupData> {
    return {
        serialize: (src, buidler) => {
            buidler.storeRef(beginCell().store(storeJettonGroupData(src)).endCell());
        },
        parse: (src) => {
            return loadJettonGroupData(src.loadRef().beginParse());
        }
    }
}

export type TokenNotification = {
    $$type: 'TokenNotification';
    query_id: bigint;
    amount: bigint;
    from: Address;
    forward_payload: Address | null;
}

export function storeTokenNotification(src: TokenNotification) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeUint(1935855772, 32);
        b_0.storeUint(src.query_id, 64);
        b_0.storeCoins(src.amount);
        b_0.storeAddress(src.from);
        b_0.storeAddress(src.forward_payload);
    };
}

export function loadTokenNotification(slice: Slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 1935855772) { throw Error('Invalid prefix'); }
    let _query_id = sc_0.loadUintBig(64);
    let _amount = sc_0.loadCoins();
    let _from = sc_0.loadAddress();
    let _forward_payload = sc_0.loadMaybeAddress();
    return { $$type: 'TokenNotification' as const, query_id: _query_id, amount: _amount, from: _from, forward_payload: _forward_payload };
}

function loadTupleTokenNotification(source: TupleReader) {
    let _query_id = source.readBigNumber();
    let _amount = source.readBigNumber();
    let _from = source.readAddress();
    let _forward_payload = source.readAddressOpt();
    return { $$type: 'TokenNotification' as const, query_id: _query_id, amount: _amount, from: _from, forward_payload: _forward_payload };
}

function storeTupleTokenNotification(source: TokenNotification) {
    let builder = new TupleBuilder();
    builder.writeNumber(source.query_id);
    builder.writeNumber(source.amount);
    builder.writeAddress(source.from);
    builder.writeAddress(source.forward_payload);
    return builder.build();
}

function dictValueParserTokenNotification(): DictionaryValue<TokenNotification> {
    return {
        serialize: (src, buidler) => {
            buidler.storeRef(beginCell().store(storeTokenNotification(src)).endCell());
        },
        parse: (src) => {
            return loadTokenNotification(src.loadRef().beginParse());
        }
    }
}

export type JettonWalletData = {
    $$type: 'JettonWalletData';
    jetton_wallet_code: Cell;
    jetton: Address;
    owner: Address;
    balance: bigint;
    prev_member: Address | null;
}

export function storeJettonWalletData(src: JettonWalletData) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeRef(src.jetton_wallet_code);
        b_0.storeAddress(src.jetton);
        b_0.storeAddress(src.owner);
        b_0.storeInt(src.balance, 257);
        let b_1 = new Builder();
        b_1.storeAddress(src.prev_member);
        b_0.storeRef(b_1.endCell());
    };
}

export function loadJettonWalletData(slice: Slice) {
    let sc_0 = slice;
    let _jetton_wallet_code = sc_0.loadRef();
    let _jetton = sc_0.loadAddress();
    let _owner = sc_0.loadAddress();
    let _balance = sc_0.loadIntBig(257);
    let sc_1 = sc_0.loadRef().beginParse();
    let _prev_member = sc_1.loadMaybeAddress();
    return { $$type: 'JettonWalletData' as const, jetton_wallet_code: _jetton_wallet_code, jetton: _jetton, owner: _owner, balance: _balance, prev_member: _prev_member };
}

function loadTupleJettonWalletData(source: TupleReader) {
    let _jetton_wallet_code = source.readCell();
    let _jetton = source.readAddress();
    let _owner = source.readAddress();
    let _balance = source.readBigNumber();
    let _prev_member = source.readAddressOpt();
    return { $$type: 'JettonWalletData' as const, jetton_wallet_code: _jetton_wallet_code, jetton: _jetton, owner: _owner, balance: _balance, prev_member: _prev_member };
}

function storeTupleJettonWalletData(source: JettonWalletData) {
    let builder = new TupleBuilder();
    builder.writeCell(source.jetton_wallet_code);
    builder.writeAddress(source.jetton);
    builder.writeAddress(source.owner);
    builder.writeNumber(source.balance);
    builder.writeAddress(source.prev_member);
    return builder.build();
}

function dictValueParserJettonWalletData(): DictionaryValue<JettonWalletData> {
    return {
        serialize: (src, buidler) => {
            buidler.storeRef(beginCell().store(storeJettonWalletData(src)).endCell());
        },
        parse: (src) => {
            return loadJettonWalletData(src.loadRef().beginParse());
        }
    }
}

export type JettonData = {
    $$type: 'JettonData';
    total_supply: bigint;
    admin_address: Address;
    mintable: boolean;
    jetton_content: Cell;
    jetton_wallet_code: Cell;
    groups_count: bigint;
    groups_handled: bigint;
}

export function storeJettonData(src: JettonData) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeCoins(src.total_supply);
        b_0.storeAddress(src.admin_address);
        b_0.storeBit(src.mintable);
        b_0.storeRef(src.jetton_content);
        b_0.storeRef(src.jetton_wallet_code);
        b_0.storeInt(src.groups_count, 257);
        b_0.storeInt(src.groups_handled, 257);
    };
}

export function loadJettonData(slice: Slice) {
    let sc_0 = slice;
    let _total_supply = sc_0.loadCoins();
    let _admin_address = sc_0.loadAddress();
    let _mintable = sc_0.loadBit();
    let _jetton_content = sc_0.loadRef();
    let _jetton_wallet_code = sc_0.loadRef();
    let _groups_count = sc_0.loadIntBig(257);
    let _groups_handled = sc_0.loadIntBig(257);
    return { $$type: 'JettonData' as const, total_supply: _total_supply, admin_address: _admin_address, mintable: _mintable, jetton_content: _jetton_content, jetton_wallet_code: _jetton_wallet_code, groups_count: _groups_count, groups_handled: _groups_handled };
}

function loadTupleJettonData(source: TupleReader) {
    let _total_supply = source.readBigNumber();
    let _admin_address = source.readAddress();
    let _mintable = source.readBoolean();
    let _jetton_content = source.readCell();
    let _jetton_wallet_code = source.readCell();
    let _groups_count = source.readBigNumber();
    let _groups_handled = source.readBigNumber();
    return { $$type: 'JettonData' as const, total_supply: _total_supply, admin_address: _admin_address, mintable: _mintable, jetton_content: _jetton_content, jetton_wallet_code: _jetton_wallet_code, groups_count: _groups_count, groups_handled: _groups_handled };
}

function storeTupleJettonData(source: JettonData) {
    let builder = new TupleBuilder();
    builder.writeNumber(source.total_supply);
    builder.writeAddress(source.admin_address);
    builder.writeBoolean(source.mintable);
    builder.writeCell(source.jetton_content);
    builder.writeCell(source.jetton_wallet_code);
    builder.writeNumber(source.groups_count);
    builder.writeNumber(source.groups_handled);
    return builder.build();
}

function dictValueParserJettonData(): DictionaryValue<JettonData> {
    return {
        serialize: (src, buidler) => {
            buidler.storeRef(beginCell().store(storeJettonData(src)).endCell());
        },
        parse: (src) => {
            return loadJettonData(src.loadRef().beginParse());
        }
    }
}

export type Mint = {
    $$type: 'Mint';
    query_id: bigint;
}

export function storeMint(src: Mint) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeUint(793212987, 32);
        b_0.storeUint(src.query_id, 64);
    };
}

export function loadMint(slice: Slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 793212987) { throw Error('Invalid prefix'); }
    let _query_id = sc_0.loadUintBig(64);
    return { $$type: 'Mint' as const, query_id: _query_id };
}

function loadTupleMint(source: TupleReader) {
    let _query_id = source.readBigNumber();
    return { $$type: 'Mint' as const, query_id: _query_id };
}

function storeTupleMint(source: Mint) {
    let builder = new TupleBuilder();
    builder.writeNumber(source.query_id);
    return builder.build();
}

function dictValueParserMint(): DictionaryValue<Mint> {
    return {
        serialize: (src, buidler) => {
            buidler.storeRef(beginCell().store(storeMint(src)).endCell());
        },
        parse: (src) => {
            return loadMint(src.loadRef().beginParse());
        }
    }
}

export type AddGroup = {
    $$type: 'AddGroup';
    query_id: bigint;
}

export function storeAddGroup(src: AddGroup) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeUint(2068106403, 32);
        b_0.storeUint(src.query_id, 64);
    };
}

export function loadAddGroup(slice: Slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 2068106403) { throw Error('Invalid prefix'); }
    let _query_id = sc_0.loadUintBig(64);
    return { $$type: 'AddGroup' as const, query_id: _query_id };
}

function loadTupleAddGroup(source: TupleReader) {
    let _query_id = source.readBigNumber();
    return { $$type: 'AddGroup' as const, query_id: _query_id };
}

function storeTupleAddGroup(source: AddGroup) {
    let builder = new TupleBuilder();
    builder.writeNumber(source.query_id);
    return builder.build();
}

function dictValueParserAddGroup(): DictionaryValue<AddGroup> {
    return {
        serialize: (src, buidler) => {
            buidler.storeRef(beginCell().store(storeAddGroup(src)).endCell());
        },
        parse: (src) => {
            return loadAddGroup(src.loadRef().beginParse());
        }
    }
}

export type TokenUpdateContent = {
    $$type: 'TokenUpdateContent';
    jetton_content: Cell;
}

export function storeTokenUpdateContent(src: TokenUpdateContent) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeUint(1615858054, 32);
        b_0.storeRef(src.jetton_content);
    };
}

export function loadTokenUpdateContent(slice: Slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 1615858054) { throw Error('Invalid prefix'); }
    let _jetton_content = sc_0.loadRef();
    return { $$type: 'TokenUpdateContent' as const, jetton_content: _jetton_content };
}

function loadTupleTokenUpdateContent(source: TupleReader) {
    let _jetton_content = source.readCell();
    return { $$type: 'TokenUpdateContent' as const, jetton_content: _jetton_content };
}

function storeTupleTokenUpdateContent(source: TokenUpdateContent) {
    let builder = new TupleBuilder();
    builder.writeCell(source.jetton_content);
    return builder.build();
}

function dictValueParserTokenUpdateContent(): DictionaryValue<TokenUpdateContent> {
    return {
        serialize: (src, buidler) => {
            buidler.storeRef(beginCell().store(storeTokenUpdateContent(src)).endCell());
        },
        parse: (src) => {
            return loadTokenUpdateContent(src.loadRef().beginParse());
        }
    }
}

 type JettonMaster_init_args = {
    $$type: 'JettonMaster_init_args';
    jetton_content: Cell;
}

function initJettonMaster_init_args(src: JettonMaster_init_args) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeRef(src.jetton_content);
    };
}

async function JettonMaster_init(jetton_content: Cell) {
    const __code = Cell.fromBase64('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');
    const __system = Cell.fromBase64('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');
    let builder = beginCell();
    builder.storeRef(__system);
    builder.storeUint(0, 1);
    initJettonMaster_init_args({ $$type: 'JettonMaster_init_args', jetton_content })(builder);
    const __data = builder.endCell();
    return { code: __code, data: __data };
}

const JettonMaster_errors: { [key: number]: { message: string } } = {
    2: { message: `Stack undeflow` },
    3: { message: `Stack overflow` },
    4: { message: `Integer overflow` },
    5: { message: `Integer out of expected range` },
    6: { message: `Invalid opcode` },
    7: { message: `Type check error` },
    8: { message: `Cell overflow` },
    9: { message: `Cell underflow` },
    10: { message: `Dictionary error` },
    13: { message: `Out of gas error` },
    32: { message: `Method ID not found` },
    34: { message: `Action is invalid or not supported` },
    37: { message: `Not enough TON` },
    38: { message: `Not enough extra-currencies` },
    128: { message: `Null reference exception` },
    129: { message: `Invalid serialization prefix` },
    130: { message: `Invalid incoming message` },
    131: { message: `Constraints error` },
    132: { message: `Access denied` },
    133: { message: `Contract stopped` },
    134: { message: `Invalid argument` },
    135: { message: `Code of a contract was not found` },
    136: { message: `Invalid address` },
    137: { message: `Masterchain support is not enabled for this contract` },
    4429: { message: `Invalid sender` },
    10446: { message: `Invalid ton value for Burn` },
    18668: { message: `Can't Mint Anymore` },
    25512: { message: `Invalid minimum ton amount` },
    36785: { message: `Not initialized yet` },
    42708: { message: `Invalid sender!` },
    58091: { message: `Not Admin` },
    62972: { message: `Invalid balance` },
}

const JettonMaster_types: ABIType[] = [
    {"name":"StateInit","header":null,"fields":[{"name":"code","type":{"kind":"simple","type":"cell","optional":false}},{"name":"data","type":{"kind":"simple","type":"cell","optional":false}}]},
    {"name":"Context","header":null,"fields":[{"name":"bounced","type":{"kind":"simple","type":"bool","optional":false}},{"name":"sender","type":{"kind":"simple","type":"address","optional":false}},{"name":"value","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"raw","type":{"kind":"simple","type":"slice","optional":false}}]},
    {"name":"SendParameters","header":null,"fields":[{"name":"bounce","type":{"kind":"simple","type":"bool","optional":false}},{"name":"to","type":{"kind":"simple","type":"address","optional":false}},{"name":"value","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"mode","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"body","type":{"kind":"simple","type":"cell","optional":true}},{"name":"code","type":{"kind":"simple","type":"cell","optional":true}},{"name":"data","type":{"kind":"simple","type":"cell","optional":true}}]},
    {"name":"Deploy","header":2490013878,"fields":[{"name":"queryId","type":{"kind":"simple","type":"uint","optional":false,"format":64}}]},
    {"name":"DeployOk","header":2952335191,"fields":[{"name":"queryId","type":{"kind":"simple","type":"uint","optional":false,"format":64}}]},
    {"name":"FactoryDeploy","header":1829761339,"fields":[{"name":"queryId","type":{"kind":"simple","type":"uint","optional":false,"format":64}},{"name":"cashback","type":{"kind":"simple","type":"address","optional":false}}]},
    {"name":"GroupCreating","header":3000929908,"fields":[{"name":"query_id","type":{"kind":"simple","type":"uint","optional":false,"format":64}}]},
    {"name":"TokenBurnNotification","header":2078119902,"fields":[{"name":"query_id","type":{"kind":"simple","type":"uint","optional":false,"format":64}},{"name":"amount","type":{"kind":"simple","type":"uint","optional":false,"format":"coins"}},{"name":"owner","type":{"kind":"simple","type":"address","optional":false}},{"name":"response_destination","type":{"kind":"simple","type":"address","optional":true}}]},
    {"name":"TokenExcesses","header":3576854235,"fields":[{"name":"query_id","type":{"kind":"simple","type":"uint","optional":false,"format":64}}]},
    {"name":"TokenTransferInternal","header":395134233,"fields":[{"name":"query_id","type":{"kind":"simple","type":"uint","optional":false,"format":64}},{"name":"amount","type":{"kind":"simple","type":"uint","optional":false,"format":"coins"}},{"name":"from","type":{"kind":"simple","type":"address","optional":false}},{"name":"response_destination","type":{"kind":"simple","type":"address","optional":false}},{"name":"forward_ton_amount","type":{"kind":"simple","type":"uint","optional":false,"format":"coins"}},{"name":"forward_payload","type":{"kind":"simple","type":"address","optional":true}}]},
    {"name":"AddToGroup","header":20657543,"fields":[{"name":"query_id","type":{"kind":"simple","type":"uint","optional":false,"format":64}},{"name":"from","type":{"kind":"simple","type":"address","optional":false}},{"name":"member","type":{"kind":"simple","type":"address","optional":false}}]},
    {"name":"TokenBurn","header":1499400124,"fields":[{"name":"query_id","type":{"kind":"simple","type":"uint","optional":false,"format":64}},{"name":"amount","type":{"kind":"simple","type":"uint","optional":false,"format":"coins"}},{"name":"owner","type":{"kind":"simple","type":"address","optional":false}},{"name":"response_destination","type":{"kind":"simple","type":"address","optional":false}}]},
    {"name":"TokenTransfer","header":260734629,"fields":[{"name":"query_id","type":{"kind":"simple","type":"uint","optional":false,"format":64}},{"name":"amount","type":{"kind":"simple","type":"uint","optional":false,"format":"coins"}},{"name":"destination","type":{"kind":"simple","type":"address","optional":false}},{"name":"response_destination","type":{"kind":"simple","type":"address","optional":false}},{"name":"custom_payload","type":{"kind":"simple","type":"cell","optional":true}},{"name":"forward_ton_amount","type":{"kind":"simple","type":"uint","optional":false,"format":"coins"}},{"name":"forward_payload","type":{"kind":"simple","type":"address","optional":false}}]},
    {"name":"JettonGroupData","header":null,"fields":[{"name":"jetton_wallet_code","type":{"kind":"simple","type":"cell","optional":false}},{"name":"jetton","type":{"kind":"simple","type":"address","optional":false}},{"name":"owner","type":{"kind":"simple","type":"address","optional":false}}]},
    {"name":"TokenNotification","header":1935855772,"fields":[{"name":"query_id","type":{"kind":"simple","type":"uint","optional":false,"format":64}},{"name":"amount","type":{"kind":"simple","type":"uint","optional":false,"format":"coins"}},{"name":"from","type":{"kind":"simple","type":"address","optional":false}},{"name":"forward_payload","type":{"kind":"simple","type":"address","optional":true}}]},
    {"name":"JettonWalletData","header":null,"fields":[{"name":"jetton_wallet_code","type":{"kind":"simple","type":"cell","optional":false}},{"name":"jetton","type":{"kind":"simple","type":"address","optional":false}},{"name":"owner","type":{"kind":"simple","type":"address","optional":false}},{"name":"balance","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"prev_member","type":{"kind":"simple","type":"address","optional":true}}]},
    {"name":"JettonData","header":null,"fields":[{"name":"total_supply","type":{"kind":"simple","type":"uint","optional":false,"format":"coins"}},{"name":"admin_address","type":{"kind":"simple","type":"address","optional":false}},{"name":"mintable","type":{"kind":"simple","type":"bool","optional":false}},{"name":"jetton_content","type":{"kind":"simple","type":"cell","optional":false}},{"name":"jetton_wallet_code","type":{"kind":"simple","type":"cell","optional":false}},{"name":"groups_count","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"groups_handled","type":{"kind":"simple","type":"int","optional":false,"format":257}}]},
    {"name":"Mint","header":793212987,"fields":[{"name":"query_id","type":{"kind":"simple","type":"uint","optional":false,"format":64}}]},
    {"name":"AddGroup","header":2068106403,"fields":[{"name":"query_id","type":{"kind":"simple","type":"uint","optional":false,"format":64}}]},
    {"name":"TokenUpdateContent","header":1615858054,"fields":[{"name":"jetton_content","type":{"kind":"simple","type":"cell","optional":false}}]},
]

const JettonMaster_getters: ABIGetter[] = [
    {"name":"get_jetton_data","arguments":[],"returnType":{"kind":"simple","type":"JettonData","optional":false}},
    {"name":"get_wallet_address","arguments":[{"name":"owner","type":{"kind":"simple","type":"address","optional":false}}],"returnType":{"kind":"simple","type":"address","optional":false}},
    {"name":"get_jetton_group_address","arguments":[{"name":"groups_count","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"owner","type":{"kind":"simple","type":"address","optional":false}}],"returnType":{"kind":"simple","type":"address","optional":false}},
]

const JettonMaster_receivers: ABIReceiver[] = [
    {"receiver":"internal","message":{"kind":"typed","type":"AddGroup"}},
    {"receiver":"internal","message":{"kind":"typed","type":"Mint"}},
    {"receiver":"internal","message":{"kind":"typed","type":"TokenUpdateContent"}},
    {"receiver":"internal","message":{"kind":"typed","type":"TokenBurnNotification"}},
    {"receiver":"internal","message":{"kind":"typed","type":"Deploy"}},
]

export class JettonMaster implements Contract {
    
    static async init(jetton_content: Cell) {
        return await JettonMaster_init(jetton_content);
    }
    
    static async fromInit(jetton_content: Cell) {
        const init = await JettonMaster_init(jetton_content);
        const address = contractAddress(0, init);
        return new JettonMaster(address, init);
    }
    
    static fromAddress(address: Address) {
        return new JettonMaster(address);
    }
    
    readonly address: Address; 
    readonly init?: { code: Cell, data: Cell };
    readonly abi: ContractABI = {
        types:  JettonMaster_types,
        getters: JettonMaster_getters,
        receivers: JettonMaster_receivers,
        errors: JettonMaster_errors,
    };
    
    private constructor(address: Address, init?: { code: Cell, data: Cell }) {
        this.address = address;
        this.init = init;
    }
    
    async send(provider: ContractProvider, via: Sender, args: { value: bigint, bounce?: boolean| null | undefined }, message: AddGroup | Mint | TokenUpdateContent | TokenBurnNotification | Deploy) {
        
        let body: Cell | null = null;
        if (message && typeof message === 'object' && !(message instanceof Slice) && message.$$type === 'AddGroup') {
            body = beginCell().store(storeAddGroup(message)).endCell();
        }
        if (message && typeof message === 'object' && !(message instanceof Slice) && message.$$type === 'Mint') {
            body = beginCell().store(storeMint(message)).endCell();
        }
        if (message && typeof message === 'object' && !(message instanceof Slice) && message.$$type === 'TokenUpdateContent') {
            body = beginCell().store(storeTokenUpdateContent(message)).endCell();
        }
        if (message && typeof message === 'object' && !(message instanceof Slice) && message.$$type === 'TokenBurnNotification') {
            body = beginCell().store(storeTokenBurnNotification(message)).endCell();
        }
        if (message && typeof message === 'object' && !(message instanceof Slice) && message.$$type === 'Deploy') {
            body = beginCell().store(storeDeploy(message)).endCell();
        }
        if (body === null) { throw new Error('Invalid message type'); }
        
        await provider.internal(via, { ...args, body: body });
        
    }
    
    async getGetJettonData(provider: ContractProvider) {
        let builder = new TupleBuilder();
        let source = (await provider.get('get_jetton_data', builder.build())).stack;
        const result = loadTupleJettonData(source);
        return result;
    }
    
    async getGetWalletAddress(provider: ContractProvider, owner: Address) {
        let builder = new TupleBuilder();
        builder.writeAddress(owner);
        let source = (await provider.get('get_wallet_address', builder.build())).stack;
        let result = source.readAddress();
        return result;
    }
    
    async getGetJettonGroupAddress(provider: ContractProvider, groups_count: bigint, owner: Address) {
        let builder = new TupleBuilder();
        builder.writeNumber(groups_count);
        builder.writeAddress(owner);
        let source = (await provider.get('get_jetton_group_address', builder.build())).stack;
        let result = source.readAddress();
        return result;
    }
    
}