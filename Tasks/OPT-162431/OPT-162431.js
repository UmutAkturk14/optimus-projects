/* OPT-162431 START */
const getMicroSegmentRank = (product) => ((product.product_attributes || {})
    .micro_segment_rank2 || []).find((rank) => rank.split(':')[0] === `${ segmentId }`);

const sortKey = (item) => parseInt((getMicroSegmentRank(item) || '').split(':')[1] || Number.MAX_SAFE_INTEGER); /* OPT-162431 */

const sortedData = data.sort((acculmator, currentValue) => sortKey(acculmator) - sortKey(currentValue));
/* OPT-162431 END */
