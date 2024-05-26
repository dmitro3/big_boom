import {useEffect, useState} from 'react';
import {JettonMaster} from '../contracts/JettonMaster';
import {useTonClient} from './useTonClient';
import {useAsyncInitialize} from './useAsyncInitialize';
import {useTonConnect} from './useTonConnect';
import {Address} from 'ton-core';

const sleep = (time) => new Promise((resolve) => setTimeout(resolve, time));

export function useJettonMasterContract() {
    const client = useTonClient();
    const [val, setVal] = useState();
    const {sender} = useTonConnect();

    const counterContract = useAsyncInitialize(async () => {
        if (!client) return;
        return client.open(await JettonMaster.fromAddress(
            Address.parse('EQBpYg8_BJgF1Zm10ahVX1u55GJzo9LoFV779vKLLzPs0YcU')
        ));
    }, [client]);

    useEffect(() => {
        async function getValue() {
            if (!counterContract) return;
            setVal(null);
            const val = await counterContract.getGetJettonData();
            setVal(val);
            await sleep(15000); // sleep 5 seconds and poll value again
            getValue();
        }

        getValue();
    }, [counterContract]);

    return {
        value: val,
        address: counterContract?.address.toString(),
        addGroup: () => {
            return counterContract?.send(
                sender,
                {
                    value: 100000000,
                },
                {
                    $$type: "AddGroup",
                    query_id: 123n,
                }
            );
        },
    };
}
