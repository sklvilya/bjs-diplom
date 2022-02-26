const logout = new LogoutButton();
logout.action = () => ApiConnector.logout((response) => {
    if (response.success) {
        location.reload();
    }      
});


ApiConnector.current( (response) => {
    if (response.success) {
        ProfileWidget.showProfile(response.data)
    }
});


let rates = new RatesBoard();
function showRates() {
ApiConnector.getStocks( (response) => {
    if (response.success) {
        rates.clearTable()
    } rates.fillTable(response.data)  
})
};
showRates();
setInterval(showRates, 1000*60);


let money = new MoneyManager();
money.addMoneyCallback = (data) => {
    ApiConnector.addMoney(data, (response) => {
        if (response.success) {
            ProfileWidget.showProfile(response.data);
            money.setMessage(response.success, `Счёт пополнен на ${data.amount} ${data.currency}`)
        } else {
            money.setMessage(response.success, response.error);
        }
    })
}
