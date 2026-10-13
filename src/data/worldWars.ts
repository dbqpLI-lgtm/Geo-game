export interface WorldWar {
  id: string;
  name: string;
  years: string;
  startYear: number;
  combatants: string;
  summary: string;
}

export const WORLD_WARS: WorldWar[] = [
  { id: 'peloponnesian', name: 'Peloponnesian War', years: '431–404 BCE', startYear: -431, combatants: 'Athens and its allies vs. Sparta and its allies', summary: 'A long conflict between rival Greek alliances that ended Athenian dominance.' },
  { id: 'second-punic', name: 'Second Punic War', years: '218–201 BCE', startYear: -218, combatants: 'The Roman Republic vs. Carthage', summary: 'Carthaginian general Hannibal invaded Italy, but Rome ultimately defeated Carthage.' },
  { id: 'hundred-years', name: 'Hundred Years’ War', years: '1337–1453', startYear: 1337, combatants: 'The Kingdom of England vs. the Kingdom of France', summary: 'A series of conflicts over the French crown and territories, ending with French victory.' },
  { id: 'thirty-years', name: 'Thirty Years’ War', years: '1618–1648', startYear: 1618, combatants: 'Habsburg and Catholic forces vs. Protestant states and their allies', summary: 'A European conflict that began in the Holy Roman Empire and ended with the Peace of Westphalia.' },
  { id: 'american-revolution', name: 'American Revolutionary War', years: '1775–1783', startYear: 1775, combatants: 'Great Britain and its allies vs. the American colonies and their allies', summary: 'The thirteen colonies won independence from Great Britain.' },
  { id: 'greek-independence', name: 'Greek War of Independence', years: '1821–1829', startYear: 1821, combatants: 'Greek revolutionaries vs. the Ottoman Empire', summary: 'An uprising that led to international recognition of an independent Greek state.' },
  { id: 'crimean', name: 'Crimean War', years: '1853–1856', startYear: 1853, combatants: 'Russia vs. the Ottoman Empire, Britain, France, and Sardinia', summary: 'Russia fought an alliance led by the Ottoman Empire, Britain, and France, largely in Crimea.' },
  { id: 'american-civil', name: 'American Civil War', years: '1861–1865', startYear: 1861, combatants: 'The Union vs. the Confederacy', summary: 'The Union defeated the seceded Confederate states; slavery was abolished.' },
  { id: 'franco-prussian', name: 'Franco-Prussian War', years: '1870–1871', startYear: 1870, combatants: 'France vs. Prussia and its German allies', summary: 'Prussia and its allies defeated France, accelerating German unification.' },
  { id: 'russo-japanese', name: 'Russo-Japanese War', years: '1904–1905', startYear: 1904, combatants: 'The Russian Empire vs. the Empire of Japan', summary: 'Japan defeated Russia in a war over influence in Korea and Manchuria.' },
  { id: 'world-war-one', name: 'World War I', years: '1914–1918', startYear: 1914, combatants: 'The Allied Powers vs. the Central Powers', summary: 'A global war that ended with the defeat of the Central Powers and the breakup of empires.' },
  { id: 'spanish-civil', name: 'Spanish Civil War', years: '1936–1939', startYear: 1936, combatants: 'The Republicans vs. the Nationalists', summary: 'The Nationalists defeated the Republican government after three years of civil war.' },
  { id: 'world-war-two', name: 'World War II', years: '1939–1945', startYear: 1939, combatants: 'The Allies vs. the Axis powers', summary: 'A global conflict that ended with the defeat of the Axis powers.' },
  { id: 'korean', name: 'Korean War', years: '1950–1953', startYear: 1950, combatants: 'North Korea and China vs. South Korea and the UN Command', summary: 'The war ended in an armistice, leaving the Korean Peninsula divided near the 38th parallel.' },
  { id: 'algerian', name: 'Algerian War', years: '1954–1962', startYear: 1954, combatants: 'The National Liberation Front (FLN) vs. France', summary: 'The war ended with Algerian independence from France.' },
  { id: 'vietnam', name: 'Vietnam War', years: '1955–1975', startYear: 1955, combatants: 'North Vietnam and the Viet Cong vs. South Vietnam and the United States', summary: 'North Vietnam and its allies prevailed, and Vietnam was reunified in 1976.' },
  { id: 'iran-iraq', name: 'Iran–Iraq War', years: '1980–1988', startYear: 1980, combatants: 'Iran vs. Iraq', summary: 'The war ended in a ceasefire without major territorial changes.' },
  { id: 'gulf', name: 'Gulf War', years: '1990–1991', startYear: 1990, combatants: 'Iraq vs. a US-led coalition', summary: 'A coalition drove Iraqi forces out of Kuwait after Iraq invaded it.' },
];
