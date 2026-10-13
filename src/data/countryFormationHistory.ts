export interface CountryFormationHistory {
  code: string;
  title: string;
  story: string;
}

export const COUNTRY_FORMATION_HISTORIES: CountryFormationHistory[] = [
  { code: 'US', title: 'United States', story: 'Thirteen British colonies declared independence in 1776. Britain recognized the new nation in 1783, and the Constitution established the federal government in 1789.' },
  { code: 'CA', title: 'Canada', story: 'The British North American colonies formed the Dominion of Canada through Confederation in 1867. Its independence developed gradually, with the Constitution Act of 1982 ending the UK Parliament’s remaining power to amend Canada’s constitution.' },
  { code: 'MX', title: 'Mexico', story: 'A rebellion against Spanish rule began in 1810. Mexico won independence in 1821 after a decade of conflict and became a republic in 1824.' },
  { code: 'BR', title: 'Brazil', story: 'Brazil declared independence from Portugal in 1822 and became an empire under Pedro I. It became a republic in 1889.' },
  { code: 'AR', title: 'Argentina', story: 'The May Revolution of 1810 began the break from Spanish rule. The United Provinces formally declared independence in 1816; the modern Argentine republic took shape over the following decades.' },
  { code: 'HT', title: 'Haiti', story: 'Enslaved people and their allies defeated French colonial rule in the Haitian Revolution. Haiti declared independence in 1804, becoming the first independent Black-led republic.' },
  { code: 'GB', title: 'United Kingdom', story: 'The 1707 Acts of Union joined England and Scotland as Great Britain. The 1801 union with Ireland created the United Kingdom of Great Britain and Ireland; most of Ireland left the union in 1922.' },
  { code: 'FR', title: 'France', story: 'The French Revolution overturned the monarchy, and France was proclaimed a republic in 1792. Its borders and governments changed repeatedly before the modern republic was established.' },
  { code: 'DE', title: 'Germany', story: 'Prussia led the unification of many German states into the German Empire in 1871. After division following World War II, East and West Germany reunified in 1990.' },
  { code: 'IT', title: 'Italy', story: 'A movement known as the Risorgimento united much of the Italian peninsula under the Kingdom of Italy in 1861. Rome joined in 1870, completing unification.' },
  { code: 'PL', title: 'Poland', story: 'Neighboring powers partitioned Poland out of existence in the late 18th century. Poland regained independence in 1918 as the empires that had divided it collapsed.' },
  { code: 'FI', title: 'Finland', story: 'Finland declared independence from Russia in December 1917 during the Russian Revolution. The new state was recognized in 1918.' },
  { code: 'NO', title: 'Norway', story: 'Norway had been in a union with Sweden since 1814. Norwegians voted to dissolve the union in 1905, and Sweden accepted the separation.' },
  { code: 'GR', title: 'Greece', story: 'Greek revolutionaries began an uprising against Ottoman rule in 1821. The Great Powers recognized an independent Greek state in 1830.' },
  { code: 'TR', title: 'Türkiye', story: 'After the Ottoman Empire’s defeat in World War I, Turkish nationalists led a war of independence. The Republic of Türkiye was proclaimed in 1923.' },
  { code: 'IN', title: 'India', story: 'British rule ended in 1947, when the subcontinent was partitioned into India and Pakistan. India became a republic when its constitution took effect in 1950.' },
  { code: 'PK', title: 'Pakistan', story: 'Pakistan was created in 1947 during the partition of British India, as a homeland for Muslims of the region. The country became a republic in 1956.' },
  { code: 'BD', title: 'Bangladesh', story: 'Formerly East Pakistan, the region fought a war of independence in 1971. Bangladesh became independent after Pakistan’s forces surrendered that December.' },
  { code: 'ID', title: 'Indonesia', story: 'Indonesian nationalists proclaimed independence from the Netherlands in 1945. After a revolution and international negotiations, the Netherlands transferred sovereignty in 1949.' },
  { code: 'CN', title: 'China', story: 'The People’s Republic of China was established in 1949 after the Chinese Civil War. The Republic of China government continued in Taiwan, and the political status of Taiwan remains disputed.' },
  { code: 'JP', title: 'Japan', story: 'The Meiji Restoration of 1868 transformed Japan into a centralized modern state. After World War II, a new constitution took effect in 1947 and established the current constitutional order.' },
  { code: 'IL', title: 'Israel', story: 'Israel declared independence in 1948 as the British Mandate for Palestine ended. The declaration and the ensuing war shaped the state’s early borders and regional conflict.' },
  { code: 'GH', title: 'Ghana', story: 'The British colony of the Gold Coast became independent as Ghana in 1957, led by Kwame Nkrumah. It was the first sub-Saharan African colony to gain independence in the postwar era.' },
  { code: 'NG', title: 'Nigeria', story: 'Britain joined its northern and southern Nigerian territories as a colony in 1914. Nigeria gained independence in 1960 and became a republic in 1963.' },
  { code: 'ZA', title: 'South Africa', story: 'The Union of South Africa formed in 1910 from four British colonies. Apartheid restricted political rights for decades; the first all-race democratic election in 1994 established a new constitutional order.' },
  { code: 'KE', title: 'Kenya', story: 'After years of anticolonial organizing and conflict, Kenya gained independence from Britain in 1963. It became a republic the following year.' },
  { code: 'TZ', title: 'Tanzania', story: 'Tanganyika became independent in 1961, and Zanzibar in 1963. The two joined in 1964 to form the United Republic of Tanzania.' },
  { code: 'AU', title: 'Australia', story: 'Six British colonies federated as the Commonwealth of Australia in 1901. Legislative and constitutional changes later established full legal independence from Britain.' },
  { code: 'NZ', title: 'New Zealand', story: 'New Zealand became a British colony in 1841 and a self-governing dominion in 1907. Its legal independence developed over time, including through the Statute of Westminster Adoption Act in 1947.' },
  { code: 'IE', title: 'Ireland', story: 'The Irish Free State was established in 1922 after the Irish War of Independence and partition. A new constitution followed in 1937, and Ireland became a republic in 1949.' },
  { code: 'SG', title: 'Singapore', story: 'Singapore became a self-governing state in 1959 and joined Malaysia in 1963. It became an independent republic in 1965 after separating from Malaysia.' },
  { code: 'UA', title: 'Ukraine', story: 'Ukraine declared independence in 1991 as the Soviet Union dissolved. A nationwide referendum later that year confirmed the decision.' },
  { code: 'CZ', title: 'Czechia', story: 'Czechia became an independent state on 1 January 1993 when Czechoslovakia peacefully dissolved. It had been part of Czechoslovakia since that state formed in 1918.' },
  { code: 'SK', title: 'Slovakia', story: 'Slovakia became an independent state on 1 January 1993 when Czechoslovakia peacefully dissolved. The split was negotiated without armed conflict.' },
  { code: 'KR', title: 'South Korea', story: 'Following Japan’s surrender in 1945, Korea was divided into occupation zones. The Republic of Korea was established in the south in 1948; the division hardened into two states.' },
  { code: 'SA', title: 'Saudi Arabia', story: 'Abdulaziz Ibn Saud unified the kingdoms of Najd and Hejaz and other territories. The Kingdom of Saudi Arabia was proclaimed in 1932.' },
];
