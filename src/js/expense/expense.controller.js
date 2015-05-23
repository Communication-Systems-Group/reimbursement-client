/**
 * Created by robinengbersen on 23.05.15.
 */
app.controller('ExpenseController', ['$scope', function($scope) {
    "use strict";

    $scope.alert = {
        info: {
            state: true,
            value: 'blabla'
        },
        success: {
            state: false,
            value: 'blabla'
        },
        danger: {
            state: false,
            value: 'blabla'
        }
    };

    $scope.expense = {
        id: 1,
        creator: {
            ldap_id: 23,
            name: 'Jens Meier'
        },
        contact: {
            person: {
                ldap_id: 3,
                name: 'Claudia Leibundgut'
            },
            phone: '044 786 23 45'
        },
        accounting: 'Reise nach New York',
        note: [{
            date: '2015-03-11T18:00:00.000+02:00',
            person: {
                ldap_id: 20,
                name: 'Burkhard Stiller'
            },
            text: 'Es fehlen noch die Belege für das Abendessen im Fridays!'
        },{
            date: '2015-03-12T16:30:00.000+02:00',
            person: {
                ldap_id: 23,
                name: 'Jens Meier'
            },
            text: 'Habe die Belege hinzugefügt'
        }],
        receipts: [{
            id: 1,
            date_receipt: '2015-01-13T18:00:00.000+02:00',
            account: 'receipt_account_excursion',
            description: 'Ausflug im Hudson',
            amount: '220.20',
            cost_center: 'E-10000-01-01',
        },{
            id: 2,
            date_receipt: '2015-01-10T18:00:00.000+02:00',
            account: 'receipt_account_travel',
            description: 'Flight ZRH => JFK',
            amount: '1210.20',
            cost_center: 'E-10000-01-01',
        },{
            id: 3,
            date_receipt: '2015-01-14T18:00:00.000+02:00',
            account: 'receipt_account_travel',
            description: 'Flight JFK => ZRH',
            amount: '1210.20',
            cost_center: 'E-10000-01-01',
        }],
        documents: [{
            url: 'url_to_pdf_doc',
            belongs_to_receipt: [2,3]
        },{
            url: 'url_to_pdf_doc',
            belongs_to_receipt: [1]
        }]
    };

}]);