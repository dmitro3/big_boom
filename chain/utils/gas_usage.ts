export function gas_usage(messageResult: any): bigint {
	return messageResult.transactions.reduce((gas: bigint, tx: any) => {
		return gas + tx.totalFees.coins;
	}, 0n)
}

export function gasCompare(messageResult: any, toCompare: bigint, accuracy: bigint = 2n): void {
	const gas = gas_usage(messageResult);
	expect(gas).toBeGreaterThanOrEqual(toCompare - accuracy);
	expect(gas).toBeLessThanOrEqual(toCompare + accuracy);
}
