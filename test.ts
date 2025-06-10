let list: number[] = [];

for (let i: number = 0; i < 100; i++) {
    let random = Math.floor(Math.random() * 100);
    list.push(random);
}

console.log(list);
