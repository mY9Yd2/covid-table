/*

ISC License

Copyright 2021 Kovács József Miklós <kovacsjozsef7u@gmail.com>

Permission to use, copy, modify, and/or distribute this software for any purpose with or without fee is hereby granted, provided that the above copyright notice and this permission notice appear in all copies.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.

*/

function escapeHTML(unsafe) {
    return unsafe
        .toString()
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

$.getJSON(
    'https://disease.sh/v3/covid-19/historical/hungary?lastdays=366',
    (data) => {
        let tableData = [];

        Object.keys(data.timeline.cases).forEach((key) => {
            tableData.push({
                date: key,
                data: { cases: data.timeline.cases[key] },
            });
        });

        Object.keys(data.timeline.deaths).forEach((key) => {
            const index = tableData.findIndex((item, i) => {
                return item.date === key;
            });
            tableData[index].data.deaths = data.timeline.deaths[key];
        });

        $('#corona-table-placeholder').hide();

        for (let i = 0; i < tableData.length - 1; i++) {
            const d = new Date(tableData[i].date);
            const fDate = `${d.getFullYear()} / ${(d.getMonth() + 1)
                .toString()
                .padStart(2, '0')} / ${d
                .getDate()
                .toString()
                .padStart(2, '0')}`;

            const cases = tableData[i + 1].data.cases - tableData[i].data.cases;
            const deaths =
                tableData[i + 1].data.deaths - tableData[i].data.deaths;

            $('#corona-table tr:first').after(`
                <tr>
                    <td>${escapeHTML(fDate)}</td>
                    <td>${escapeHTML(
                        cases.toString().replace(/(\d)(?=(\d{3})+$)/g, '$1 ')
                    )}</td>
                    <td>${escapeHTML(
                        deaths.toString().replace(/(\d)(?=(\d{3})+$)/g, '$1 ')
                    )}</td>
                    <td>${escapeHTML(
                        tableData[i + 1].data.deaths
                            .toString()
                            .replace(/(\d)(?=(\d{3})+$)/g, '$1 ')
                    )}</td>
                </tr>
            `);
        }
    }
);
