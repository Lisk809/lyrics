const fs = require("fs")
const garti = (num) => "https://lyrics.net.cn/artist/" + num
const cmatcher = /<h1 style="margin-bottom: 0;padding: 0;">(.*?)<\/h1>/gm
const gcover = async (url) => {
    const a = await fetch(url).then(e => e.text())
    const b = a.match(cmatcher)
    if(b){
      const c = b[0].replace(cmatcher, "$1")
      return c
    }
    return 0;
}
async function main() {
    for (let o = 556; o < 1056; o++) {
        console.log(o)
        const arti = garti(o)
        const cover = await gcover(arti)
        if(cover){
        fs.mkdirSync(o + cover)
        const rsongs = (await fetch(arti).then(e => e.text())).match(/<a href="\/lyrics\/(.*?)">(.*?)<\/a>/gm)
        const songs = rsongs.map(e => e.replace(/<a href="\/lyrics\/(.*?)">(.*?)<\/a>/gm, "$1_$2").split("_"))

        for (let i in songs) {
            a = await fetch("https://lyrics.net.cn/lyrics/" + songs[i][0]).then(e => e.text())
            b = a.match(/<div>(.*?)<\/div>/gm).filter(e => e.length <= 50)
            songs[i].push(b.map(e => e.replace(/<div>(.*?)<\/div>/, "$1")))
        }
        const lyrics = songs.map(e => {
            return {
                name: e[1],
                cover: cover,
                content: e[2],
                song: e[0]
            }
        })
        for (let j in lyrics) {
            fs.writeFileSync(`./${o + cover}/${lyrics[j].song}.json`, JSON.stringify(lyrics[j]))
        }
    } else{
      continue
    }
    }

}
main()