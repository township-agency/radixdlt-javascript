import { isRadixParticle, RadixParticleType } from './meta/radixParticleTypes'
import {
	tokenDSONKeyValues,
	tokenParticleProps,
	TokenParticleInput,
	withTokenParticleEquals,
} from './meta/tokenParticle'
import { DSONCodable, DSONEncoding } from '@radixdlt/dson'
import { TokenParticle, UnallocatedTokensParticle } from './_types'

const radixParticleType = RadixParticleType.UNALLOCATED_TOKENS
const SERIALIZER = 'radix.particles.unallocated_tokens'

const DSON = (input: TokenParticle): DSONCodable =>
	DSONEncoding({
		serializer: SERIALIZER,
		encodingMethodOrKeyValues: [...tokenDSONKeyValues(input)],
	})

export const unallocatedTokensParticle = (
	input: TokenParticleInput,
): UnallocatedTokensParticle => {
	const props = {
		...tokenParticleProps(input),
		radixParticleType: radixParticleType,
	}

	return {
		...DSON(props),

		...withTokenParticleEquals((_: UnallocatedTokensParticle) => true)(
			props,
		),

		...props,
	}
}

export const isUnallocatedTokensParticle = (
	something: unknown,
): something is UnallocatedTokensParticle => {
	if (!isRadixParticle(something)) return false
	return something.radixParticleType === radixParticleType
}
