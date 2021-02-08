import { addressFromBase58String } from '@radixdlt/crypto'
import { resourceIdentifierFromAddressAndName } from '@radixdlt/atom'
import { amountFromUnsafe, Denomination } from '@radixdlt/primitives'
import { transferTokensAction } from '../src/transferTokensAction'
import { TransferTokensActionInput } from '../src/_types'
import { zero } from '@radixdlt/primitives/src/amount'

describe('TransferTokensActions', () => {
	const alice = addressFromBase58String(
		'9S8khLHZa6FsyGo634xQo9QwLgSHGpXHHW764D5mPYBcrnfZV6RT',
	)._unsafeUnwrap()

	const bob = addressFromBase58String(
		'9S9LHeQNFpNJYqLtTJeAbos1LCC5Q7HBiGwPf2oju3NRq5MBKAGt',
	)._unsafeUnwrap()

	const resourceIdentifier = resourceIdentifierFromAddressAndName({
		address: alice,
		name: 'FOOBAR',
	})
	const amount = amountFromUnsafe(6, Denomination.Atto)._unsafeUnwrap()

	const message = "Hey Bob! Here's some money for our lunch earlier."

	const input = <TransferTokensActionInput>{
		to: bob,
		from: alice,
		amount: amount,
		resourceIdentifier: resourceIdentifier,
	}

	it(`should have a 'recipient' equal to 'input.to'.`, () => {
		const tokenTransfer = transferTokensAction({
			...input,
			to: bob,
		})
		expect(tokenTransfer.recipient.equals(bob)).toBe(true)
	})

	it(`should have an 'amount' equal to 'input.amount'.`, () => {
		const tokenTransfer = transferTokensAction(input)
		expect(tokenTransfer.amount.equals(amount)).toBe(true)
	})

	it(`should have a 'sender' equal to 'input.from'.`, () => {
		const tokenTransfer = transferTokensAction({
			...input,
			from: alice,
		})
		expect(tokenTransfer.sender.equals(alice)).toBe(true)
	})

	it('should be able to skip message.', () => {
		const tokenTransfer = transferTokensAction(input)
		expect(tokenTransfer).toBeDefined()
		expect(tokenTransfer.message).toBeUndefined()
	})

	it('should be able to include a message.', () => {
		const tokenTransfer = transferTokensAction({
			...input,
			message: message,
		})
		expect(tokenTransfer.message).toBe(message)
	})

	it('should generate a UUID if none is provided.', () => {
		const tokenTransfer = transferTokensAction(input)
		expect(tokenTransfer.uuid).toBeTruthy()
	})

	it('should be able to specify a UUID.', () => {
		const uuid = 'randomly generated string'
		const tokenTransfer = transferTokensAction({
			...input,
			uuid,
		})
		expect(tokenTransfer.uuid).toBe(uuid)
	})

	it('should be possible to transfer 0 tokens', () => {
		const tokenTransfer = transferTokensAction({
			...input,
			amount: zero,
		})

		expect(tokenTransfer.amount.equals(zero)).toBe(true)
	})
})