import datetime
import os
from selenium import webdriver
from pyvirtualdisplay import Display

FILE_NAME = 'scraped/scraper.log'
SCHEDULES = [
    {
        'src': 'MNL',
        'dest': 'NRT',
        'from_date': '2018-04-27',
        'to_date': '2018-05-06',
    }
]
SEARCH_URL = (
    "https://beta.cebupacificair.com/Flight/Select?"
    "o1={src}&d1={dest}&o2=&d2=&dd1={from_date}&dd2={to_date}"
    "&r=true&ADT=1&CHD=0&INF=0&inl=0&pos=cebu.ph&culture="
)


def start():
    print('Starting')
    display = Display(visible=0, size=(800, 800))
    display.start()
    driver = webdriver.Firefox()

    def cleanup():
        print('Done! Cleaning up!')
        driver.close()
        driver.quit()
        display.stop()

    return (driver, cleanup)

if __name__ == '__main__':
    driver, cleanup = start()
    os.makedirs(os.path.dirname(FILE_NAME), exist_ok=True)

    print('Iterating over schedules')
    for schedule in SCHEDULES:
        driver.get(SEARCH_URL.format(
            src=schedule['src'],
            dest=schedule['dest'],
            from_date=schedule['from_date'],
            to_date=schedule['to_date'],
        ))

        print('GET-ing Departing price')
        departing_price = driver.find_element_by_css_selector(
            (
                "div.active.flights-schedule-col.depart-col"
                " > a > p.price.lowFareAmt"
            )
        )

        print('GET-ing Return price')
        return_price = driver.find_element_by_css_selector(
            (
                "div.active.flights-schedule-col.return-col"
                " > a > p.price.lowFareAmt"
            )
        )

        print('Logging prices')
        with open(FILE_NAME, "r+") as file:
            data = file.read().split('\n')[:-1]
            if len(data) >= 10:
                data = data[1:]
            data.append(
                "{}_{}_{}_{}_{}_{}_{}\n".format(
                    schedule['src'],
                    schedule['dest'],
                    schedule['from_date'],
                    schedule['to_date'],
                    datetime.datetime.now().strftime('%Y-%m-%d %H:%M'),
                    departing_price.text.replace(',', '')[:-1],
                    return_price.text.replace(',', '')[:-1]
                )
            )
            file.seek(0)
            file.truncate()
            file.write('\n'.join(data))
    cleanup()
