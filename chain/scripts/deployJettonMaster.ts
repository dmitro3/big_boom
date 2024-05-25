import { toNano } from '@ton/core';
import { JettonMaster } from '../wrappers/JettonMaster';
import { NetworkProvider } from '@ton/blueprint';
import { jettonData, toCell } from '../utils/jetton_content';

export async function run(provider: NetworkProvider) {
    const jettonContent = await toCell(jettonData)

    const jettonMaster = provider.open(await JettonMaster.fromInit(jettonContent));

    await jettonMaster.send(
        provider.sender(),
        {
            value: toNano('0.1'),
        },
        {
            $$type: 'Deploy',
            queryId: 129123123132n,
        }
    );

    await provider.waitForDeploy(jettonMaster.address);

    console.log('>>> address', jettonMaster.address);
}
