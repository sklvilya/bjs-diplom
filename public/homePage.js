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
};


money.conversionMoneyCallback = (data) => {
    ApiConnector.convertMoney(data, (response) => {
        if (response.success) {
            ProfileWidget.showProfile(response, data);
            money.setMessage(response.success, `${data.fromAmount} ${data.fromCurrency} конвертированы в ${data.targetCurrency}`);
        } else {
            money.setMessage(response.success, response.error);
        }
    })
};


money.sendMoneyCallback = (data) => {
    ApiConnector.transferMoney(data, (response) => {
        console.log(data, response);
        if (response.success) {
            ProfileWidget.showProfile(response.data);
            money.setMessage(response.success, `${data.amount} ${data.currency} переведен пользователю № ${data}`);
        } else {
            money.setMessage(response.success, response.error);
        }
    })
};


let favorites = new FavoritesWidget();

ApiConnector.getFavorites((response) => {
    if (response.success) {
        favorites.clearTable();
        favorites.fillTable(response.data);
        money.updateUsersList(response.data);
    }
});


favorites.addUserCallback = (data) => {
    ApiConnector.addUserToFavorites(data, (response) => {
        if (response.success) {
            favorites.clearTable();
            favorites.fillTable(response.data);
            money.updateUsersList(response.data);
            favorites.setMessage(response.success, `${data.name} добавлен в список друзей`);
        } else {
            favorites.setMessage(response.success, response.error);
        }
    })
};
