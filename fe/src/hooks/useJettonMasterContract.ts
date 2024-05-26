import {useEffect, useState} from 'react';
import {JettonMaster} from '../contracts/JettonMaster';
import {useTonClient} from './useTonClient';
import {useAsyncInitialize} from './useAsyncInitialize';
import {useTonConnect} from './useTonConnect';
import {Address, OpenedContract} from 'ton-core';

const sleep = (time: number) => new Promise((resolve) => setTimeout(resolve, time));

export function useJettonMasterContract() {
    const client = useTonClient();
    const [val, setVal] = useState<null | any>();
    const {sender} = useTonConnect();

    const counterContract = useAsyncInitialize(async () => {
        if (!client) return;
        return client.open(await JettonMaster.fromAddress(
            Address.parse('EQBZVBnfFD1tLqF64YIIpyazps2y_aYznKqdsj6I_MaRMBvG')
        ) as any) as OpenedContract<JettonMaster>;
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
