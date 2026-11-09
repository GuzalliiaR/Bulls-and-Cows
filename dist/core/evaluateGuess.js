export function evaluateGuess(secret, guess) {
    const normalizedSecret = secret.map((element) => element.toLowerCase());
    let restSecret = [...normalizedSecret];
    const arrGuess = guess.toLowerCase().split('');
    const bulls = arrGuess.reduce((sumBulls, element, index) => {
        if (element === normalizedSecret[index]) {
            restSecret = restSecret.filter((el) => el !== element);
            sumBulls += 1;
        }
        return sumBulls;
    }, 0);
    const cows = restSecret.filter((element) => arrGuess.includes(element)).length;
    return { bulls, cows };
}
//# sourceMappingURL=evaluateGuess.js.map