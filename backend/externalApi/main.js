export async function getFortnitePlayerData(username) {
    console.log(username)
    const URL = `https://fortnite-api.com/v2/stats/br/v2/?name=${username}&Authorization=221a2fd5-853a-4764-a571-a2d5de14aa16`
    const response = await fetch(URL)
    console.log(response)
    const data = await response.json()
    console.log(data)
    return data
}
