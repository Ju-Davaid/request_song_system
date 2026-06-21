export const isSameDuration = (duration: number, playerDuration: number) => {
    const durationDiff = Math.abs(duration - playerDuration);
    return durationDiff <= 5;
}