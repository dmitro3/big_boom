import { Blockchain, SandboxContract, TreasuryContract } from '@ton/sandbox';
import {
    Address,
    Cell,
    toNano
} from '@ton/core';
import { JettonGroup } from '../wrappers/JettonGroup';
import { JettonMaster } from '../wrappers/JettonMaster';
// import { JettonWallet } from '../wrappers/JettonWallet';
import '@ton/test-utils';
import {
    fromCell,
    jettonData,
    normalStr,
    st,
    toCell
} from '../utils/jetton_content';
import { flattenSnakeCell } from '../utils/snake_parse';

describe('TeamMinter', () => {
    let blockchain: Blockchain;
    let deployer: SandboxContract<TreasuryContract>;
    let jettonMaster: SandboxContract<JettonMaster>;
    let deployerJettonAddress: Address;

    beforeEach(async () => {
        blockchain = await Blockchain.create();

        deployer = await blockchain.treasury('deployer');

        let jettonContent = await toCell(jettonData);

        jettonMaster = blockchain.openContract(await JettonMaster.fromInit(jettonContent));

        const deployResult = await jettonMaster.send(
            deployer.getSender(),
            {
                value: toNano('0.05'),
            },
            {
                $$type: 'Deploy',
                queryId: 0n,
            }
        );

        expect(deployResult.transactions).toHaveTransaction({
            from: deployer.address,
            to: jettonMaster.address,
            deploy: true,
            success: true,
        });

        deployerJettonAddress = await jettonMaster.getGetWalletAddress(deployer.address);
        // gasCompare(deployResult, 47055192n);
    });

    describe("base checks", () => {
        it('should deploy', async () => {
            // the check is done inside beforeEach
            // blockchain and jettonMaster are ready to use
        });

        it('should receive minter data', async () => {
            const minterData = await jettonMaster.getGetJettonData();

            expect(minterData.admin_address).toEqualAddress(deployer.address);
            expect(minterData.mintable).toBe(true);
            expect(minterData.total_supply).toBe(0n);

            let { flag, content } = await fromCell(minterData.jetton_content);
            expect(flag).toBe(0);
            expect(content).toEqual(jettonData);
        });

        it("parse cell from hex string", async () => {
            let cell = Cell.fromBase64(Buffer.from("b5ee9c7201020f0100013000010300c00102012002030143bff082eb663b57a00192f4a6ac467288df2dfeddb9da1bee28f6521c8bebd21f1ec004020120050600560068747470733a2f2f6d69726f7370686572652e6f72672f6d69726f7370686572652e6c6f676f2e706e6702012007080201200b0c0141bf4546a6ffe1b79cfdd86bad3db874313dcde2fb05e6a74aa7f3552d9617c79d13090141bf6ed4f942a7848ce2cb066b77a1128c6a1ff8c43f438a2dce24612ba9ffab8b030a0016004d69726f737068657265000a004d49524f0141bf5208def46f5a1d4f9dce66ab309f4a851305f166f91ef79d923ef58e34f9a2090d0141bf5d01fa5e3c06901c45046c6b2ddcea5af764fea0eed72a10d404f2312ceb247d0e00360046726f6d2070656f706c6520746f2067656e65726174696f6e7300040039", 'hex').toString("base64"));
            // let s = cell.beginParse();
            // let flag = s.loadUint(8);
            const { flag, content } = await fromCell(cell);
            expect(flag).toBe(0);
            expect(content).toEqual(jettonData);
        });

        it("parse string to cell and revert it back", async () => {
            let myStr = "From people to generations";
            let str = st(myStr);
            expect(normalStr(flattenSnakeCell(str).toString("utf-8"))).toEqual(myStr);
        });

        it("to cell and from cell", async () => {
            let cell = await toCell(jettonData);
            let data = await fromCell(cell);
            expect(data.content).toEqual(jettonData);
        });

        it("replace null values in string", async () => {
            let str1 = normalStr("\x00\x00\x00\x00\x00\x00Mirosphere");
            expect(str1).toEqual("Mirosphere");
            expect(str1.length).toEqual(10);

            let str2 = normalStr("\x00\x00\x00\x00\x00\x00From people to generations");
            expect(str2).toEqual("From people to generations");
            expect(str2.length).toEqual(26);

            let str3 = normalStr("\x00\x00\x00\x00\x00\x009");
            expect(str3).toEqual("9");
            expect(str3.length).toEqual(1);
        });
    });

    describe("add group", () => {
        it("add group seq_num", async () => {
            let jettonDataBefore = await jettonMaster.getGetJettonData();
            expect(jettonDataBefore.groups_count).toBe(0n);

            let res = await jettonMaster.send(
                deployer.getSender(),
                {
                    value: toNano('0.5'),
                },
                {
                    $$type: "AddGroup",
                    query_id: 123n,
                }
            );

            let jettonData = await jettonMaster.getGetJettonData();
            expect(jettonData.groups_count).toBe(1n);

            let group_address = await jettonMaster.getGetJettonGroupAddress(1n, deployer.address);
            let groupContract = blockchain.openContract(await JettonGroup.fromAddress(group_address));
            let groupOwner = await groupContract.getGetOwner();
            expect(groupOwner).toEqualAddress(deployer.address);
        });
    });

    describe("mint action", () => {
        it("mint and changed amount", async () => {
            const minterDataBefore = await jettonMaster.getGetJettonData();
            expect(minterDataBefore.total_supply).toEqual(0n);

            let res = await jettonMaster.send(
                deployer.getSender(),
                {
                    value: toNano('0.5'),
                },
                {
                    $$type: "Mint",
                    query_id: 12n,
                }
            );
            // expect(res.transactions.length).toBe(3);
            const jettonData = await jettonMaster.getGetJettonData();
            expect(jettonData.groups_count).toBe(0n);

            const minterDataAfter = await jettonMaster.getGetJettonData();
            expect(minterDataAfter.total_supply).toEqual(0n);
        });

        it("mint after add group", async () => {
            const minterDataBefore = await jettonMaster.getGetJettonData();
            expect(minterDataBefore.total_supply).toEqual(0n);

            let res1 = await jettonMaster.send(
                deployer.getSender(),
                {
                    value: toNano('0.5'),
                },
                {
                    $$type: "AddGroup",
                    query_id: 123n,
                }
            );

            let res2 = await jettonMaster.send(
                deployer.getSender(),
                {
                    value: toNano('0.5'),
                },
                {
                    $$type: "Mint",
                    query_id: 12n,
                }
            );
            expect(res2.transactions.length).toBe(4);
            const jettonData = await jettonMaster.getGetJettonData();
            expect(jettonData.groups_count).toBe(1n);

            const minterDataAfter = await jettonMaster.getGetJettonData();
            expect(minterDataAfter.total_supply).toEqual(100000000000n);

            let group_address = await jettonMaster.getGetJettonGroupAddress(1n, deployer.address);
            const group = blockchain.openContract(await JettonGroup.fromAddress(group_address));
            const groupData = await group.getGetGroupData();
            expect(groupData.owner).toEqualAddress(deployer.address);
        });
    });

    describe("add member to group", () => {
        it("add member", async () => {

        });
    });
});
