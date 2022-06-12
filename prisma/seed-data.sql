--
-- PostgreSQL database dump
--

-- Dumped from database version 14.2
-- Dumped by pg_dump version 14.2

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Data for Name: categories; Type: TABLE DATA; Schema: public; Owner: perenstrom
--

COPY public.categories (slug, name) FROM stdin;
best-actor	Best Actor
best-actress	Best Actress
best-adapted-screenplay	Best Adapted Screenplay
best-animated-feature	Best Animated Feature
best-animated-short	Best Animated Short
best-cinematography	Best Cinematography
best-costume	Best Costume
best-director	Best Director
best-documentary	Best Documentary
best-documentary-short	Best Documentary Short
best-editing	Best Editing
best-hair-and-makeup	Best Hair and Makeup
best-international-film	Best International Film
best-live-action-short	Best Live Action Short
best-original-score	Best Original Score
best-original-screenplay	Best Original Screenplay
best-original-song	Best Original Song
best-picture	Best Picture
best-production-design	Best Production Design
best-sound	Best Sound
best-sound-editing	Best Sound Editing
best-sound-mixing	Best Sound Mixing
best-supporting-actor	Best Supporting Actor
best-supporting-actress	Best Supporting Actress
best-visual-effects	Best Visual Effects
\.


--
-- Data for Name: films; Type: TABLE DATA; Schema: public; Owner: perenstrom
--

COPY public.films (imdb_id, name, poster_url) FROM stdin;
tt9770150	Nomadland	https://image.tmdb.org/t/p/w342/fmHBjfiMb7cP0cikF17LoA8E1bp.jpg
tt10618286	Mank	https://image.tmdb.org/t/p/w342/1VF9IcI4Vyrd2oYrVp0oNuPeE70.jpg
tt9784798	Judas and the Black Messiah	https://image.tmdb.org/t/p/w342/iIgr75GoqFxe1X5Wz9siOODGe9u.jpg
tt10633456	Minari	https://image.tmdb.org/t/p/w342/9Bb6K6HINl3vEKCu8WXEZyHvvpq.jpg
tt5363618	Sound of Metal	https://image.tmdb.org/t/p/w342/y89kFMNYXNKMdlZjR2yg7nQtcQH.jpg
tt1070874	The Trial of the Chicago 7	https://image.tmdb.org/t/p/w342/ahf5cVdooMAlDRiJOZQNuLqa1Is.jpg
tt10272386	The Father	https://image.tmdb.org/t/p/w342/pr3bEQ517uMb5loLvjFQi8uLAsp.jpg
tt9620292	Promising Young Woman	https://image.tmdb.org/t/p/w342/cjzU4g6SlScnP4MdkleyI25KGlR.jpg
tt10514222	Ma Rainey's Black Bottom	https://image.tmdb.org/t/p/w342/pvtyxijaBrCSbByXLcUIDDSvc40.jpg
tt6878306	News of the World	https://image.tmdb.org/t/p/w342/fYQCgVRsQTEfUrP7cW5iAFVYOlh.jpg
tt10612922	One Night in Miami	https://image.tmdb.org/t/p/w342/1DLUb9PTDqXMSgsD7RmiJs7ZJIx.jpg
tt2948372	Soul	https://image.tmdb.org/t/p/w342/hm58Jw4Lw8OIeECIq5qyPYhAeRJ.jpg
tt10288566	Another Round	https://image.tmdb.org/t/p/w342/fsn4cjpCvWuP9wU9hcFnK7M8RZC.jpg
tt13143964	Borat Subsequent Moviefilm	https://image.tmdb.org/t/p/w342/kwh9dYvZLn7yJ9nfU5sPj2h9O7l.jpg
tt10706602	Collective	https://image.tmdb.org/t/p/w342/oR93n0CAn2GznyHDFSRTp0J1t8c.jpg
tt9214832	Emma.	https://image.tmdb.org/t/p/w342/uHpHzbHLSsVmAuuGuQSpyVDZmDc.jpg
tt6772802	Hillbilly Elegy	https://image.tmdb.org/t/p/w342/7mfMBPYCnzDYExWQOHXhHpSJ3Ip.jpg
tt4566758	Mulan	https://image.tmdb.org/t/p/w342/aKx1ARwG55zZ0GpRvU2WrGrCG9o.jpg
tt8333746	Pinocchio	https://image.tmdb.org/t/p/w342/lzqJcPaZA9G8C6eS4Hch475Ng3A.jpg
tt6723592	Tenet	https://image.tmdb.org/t/p/w342/k68nPLbIST6NP96JmTxmZijEvCA.jpg
tt11161474	Pieces of a Woman	https://image.tmdb.org/t/p/w342/OgUfLlhfBFx5BPK6LzBWFvBW1w.jpg
tt8521718	The United States vs. Billie Holiday	https://image.tmdb.org/t/p/w342/vEzkxuE2sJcmHYjXQHM8xvR9ICH.jpg
tt6571548	The White Tiger	https://image.tmdb.org/t/p/w342/7K4mdWaLGF2F4ASb2L12tlya9c9.jpg
tt9777644	Da 5 Bloods	https://image.tmdb.org/t/p/w342/yx4cp1ljJMDSFeEex0Zjv45b55E.jpg
tt8580274	Eurovision Song Contest: The Story of Fire Saga	https://image.tmdb.org/t/p/w342/9zrbgYyFvwH8sy5mv9eT25xsAzL.jpg
tt10627584	The Life Ahead	https://image.tmdb.org/t/p/w342/6oTn5kXRS84exXTC7XcqotKZu9B.jpg
tt6048922	Greyhound	https://image.tmdb.org/t/p/w342/kjMbDciooTbJPofVXgAoFjfX8Of.jpg
tt2222042	Love and Monsters	https://image.tmdb.org/t/p/w342/r4Lm1XKP0VsTgHX4LG4syAwYA2I.jpg
tt10539608	The Midnight Sky	https://image.tmdb.org/t/p/w342/tbI9bhZlYmfWGkqY1Wje9Sg3He9.jpg
tt3661394	The One and Only Ivan	https://image.tmdb.org/t/p/w342/wDOyGAiTaXvjKGmnmXsoFO7zItt.jpg
tt7146812	Onward	https://image.tmdb.org/t/p/w342/f4aul3FyD3jv3v4bul1IrkWZvzq.jpg
tt7488208	Over the Moon	https://image.tmdb.org/t/p/w342/lQfdytwN7eh0tXWjIiMceFdBBvD.jpg
tt6193408	A Shaun the Sheep Movie: Farmageddon	https://image.tmdb.org/t/p/w342/p08FoXVFgcRm5QZBaGj0VKa2W2Y.jpg
tt5198068	Wolfwalkers	https://image.tmdb.org/t/p/w342/vqGiNbdc2sDwsnivMMYzwAoSSu6.jpg
tt8923484	Crip Camp	https://image.tmdb.org/t/p/w342/iALSypN3MhC6kBVwc9VpuJUlm1j.jpg
tt11394298	The Mole Agent	https://image.tmdb.org/t/p/w342/3EQ844RgkCg5WQvx3tCNuZ5qf8S.jpg
tt12888462	My Octopus Teacher	https://image.tmdb.org/t/p/w342/hvTVZb7hBC8tZAGoEhH5eiMJu2B.jpg
tt11416746	Time	https://image.tmdb.org/t/p/w342/hchRmyJ2FIkJtoqALWScxGlwu5E.jpg
tt9586294	Better Days	https://image.tmdb.org/t/p/w342/ev8PDIuKm2j3m3jWxw497zCLjzu.jpg
tt10360862	The Man Who Sold His Skin	https://image.tmdb.org/t/p/w342/o1wRIwEttuWUByTm1wXsfCstNlh.jpg
tt8633462	Quo Vadis, Aida?	https://image.tmdb.org/t/p/w342/guBfvuR0ije9hHEO2bhVW958fYy.jpg
tt9280166	Feeling Through	https://image.tmdb.org/t/p/w342/5sCBgrlDRAEH75RGwpwqEBlUNuo.jpg
tt11962160	The Letter Room	https://image.tmdb.org/t/p/w342/7LprTwZjcOypctn6KqoQId3CpNE.jpg
tt11474480	The Present	https://image.tmdb.org/t/p/w342/kPou4N6kfuzmatjTLpMYofubIXq.jpg
tt13472984	Two Distant Strangers	https://image.tmdb.org/t/p/w342/goTRnLgLjr3hdlBHVcFg1VS9eMI.jpg
tt10538710	White Eye	https://image.tmdb.org/t/p/w342/yw8ZPxfqrqhafWZSq9SMhSqv1y9.jpg
tt13167288	Burrow	https://image.tmdb.org/t/p/w342/4GsPj1s8Cbqh8Sh9Ko2YO4kSGlo.jpg
tt11884670	Genius Loci	https://image.tmdb.org/t/p/w342/udF2tv3W1cUwa1er7lxPqtnJRmb.jpg
tt11768948	If Anything Happens I Love You	https://image.tmdb.org/t/p/w342/85tDhACvKDQxQoJhBYLvDU0ik1n.jpg
tt14039636	Opera	https://image.tmdb.org/t/p/w342/bEuvSPk62lna2h6yt94hgbgCdZh.jpg
tt12706728	Yes People	https://image.tmdb.org/t/p/w342/aLaeAw9HtIC6n5XMHgPdEX2yM9t.jpg
tt11643154	Colette	https://image.tmdb.org/t/p/w342/j80ICrHAzuP4txNVg9rYgQZgI4f.jpg
tt13793326	A Concerto Is a Conversation	https://image.tmdb.org/t/p/w342/4Rm6U11TB7JUEQHArUnOfeirZGE.jpg
tt11512676	Do Not Split	https://image.tmdb.org/t/p/w342/rPZoRW1mtUa5csfJhKzF1pKjy0R.jpg
tt12979636	Hunger Ward	https://image.tmdb.org/t/p/w342/id9xd3P5UQSGrh9HutKZURwxeu8.jpg
tt8993180	A Love Song for Latasha	https://image.tmdb.org/t/p/w342/pZ3PHUoqfxJYyNgprIrQJs3HgWP.jpg
tt3224458	A Beautiful Day in the Neighborhood	https://image.tmdb.org/t/p/w342/p9vCAVhDK375XyobVcKqzqzsUHE.jpg
tt7131622	Once Upon a Time… in Hollywood	https://image.tmdb.org/t/p/w342/8j58iEBw9pOXFD2L0nt0ZXeHviB.jpg
tt1302006	The Irishman	https://image.tmdb.org/t/p/w342/mbm8k3GFhXS0ROd9AD1gqYbIFbM.jpg
tt8404614	The Two Popes	https://image.tmdb.org/t/p/w342/4d4mTSfDIFIbUbMLUfaKodvxYXA.jpg
tt8579674	1917	https://image.tmdb.org/t/p/w342/iZf0KyrE25z1sage4SYFLCCrMi9.jpg
tt6394270	Bombshell	https://image.tmdb.org/t/p/w342/gbPfvwBqbiHpQkYZQvVwB6MVauV.jpg
tt7286456	Joker	https://image.tmdb.org/t/p/w342/udDclJoHjfjb8Ekgsd4FDteOkCU.jpg
tt7549996	Judy	https://image.tmdb.org/t/p/w342/iqJhHjD6k6T07waELjMKDpQJUP.jpg
tt4777008	Maleficent: Mistress of Evil	https://image.tmdb.org/t/p/w342/vloNTScJ3w7jwNwtNGoG8DbTThv.jpg
tt2584384	Jojo Rabbit	https://image.tmdb.org/t/p/w342/7GsM4mtM0worCtIVeiQt28HieeN.jpg
tt3281548	Little Women	https://image.tmdb.org/t/p/w342/yn5ihODtZ7ofn8pDYfxCmxh8AXI.jpg
tt9351980	American Factory	https://image.tmdb.org/t/p/w342/7jH3dQOJ3CHMrp9tWsI3rRCDiaD.jpg
tt9617456	For Sama	https://image.tmdb.org/t/p/w342/mDna51F8QfrJFZOgPGQUz3VKqsB.jpg
tt8991268	Honeyland	https://image.tmdb.org/t/p/w342/bvO1rKTjohHjdYAZDkG8Ygz1KdC.jpg
tt7178226	The Cave	https://image.tmdb.org/t/p/w342/2Zb8U2EXBv36DGG9jaEESNEeJv9.jpg
tt6016744	The Edge of Democracy	https://image.tmdb.org/t/p/w342/mIbPkZelgguJMPOx9vvCb5oqMxI.jpg
tt1950186	Ford v Ferrari	https://image.tmdb.org/t/p/w342/dR1Ju50iudrOh3YgfwkAU1g2HZe.jpg
tt2527338	Star Wars: The Rise of Skywalker	https://image.tmdb.org/t/p/w342/db32LaOibwEliAmSL2jjDF6oDdj.jpg
tt2935510	Ad Astra	https://image.tmdb.org/t/p/w342/xBHvZcjRiWyobQ9kxBhO6B2dtRI.jpg
tt6751668	Parasite	https://image.tmdb.org/t/p/w342/7IiTTgloJzvGI1TAYymCfbfl3vT.jpg
tt8649186	Corpus Christi	https://image.tmdb.org/t/p/w342/6VZlm8sEwxkE3L5nXxz17QLj1sF.jpg
tt10199590	Les Misérables	https://image.tmdb.org/t/p/w342/pUc2ZaIxvPHROjT0Trd6tpSnTme.jpg
tt8291806	Pain and Glory	https://image.tmdb.org/t/p/w342/cMlueArJXXwZbeLpb4NhC3pxmBk.jpg
tt7653254	Marriage Story	https://image.tmdb.org/t/p/w342/pZekG6xabTmZxjmYw10wN84Hp8d.jpg
tt3513548	Richard Jewell	https://image.tmdb.org/t/p/w342/5Lgkm8jt4roAFPZQ52fKMhVmDaZ.jpg
tt10923134	Daughter	https://image.tmdb.org/t/p/w342/55aCc3X19i3BSUj4pEzedO4C7VP.jpg
tt7129636	Hair Love	https://image.tmdb.org/t/p/w342/pm9uRa7031Z56unxNE8AqE8f2wg.jpg
tt9536832	Kitbull	https://image.tmdb.org/t/p/w342/mwKO3cZbxipgd9QAPboJVTDLPiN.jpg
tt10499942	Memorable	https://image.tmdb.org/t/p/w342/eLW86bTGdsSADHgLBZZSpiO95s5.jpg
tt9032798	Sister	https://image.tmdb.org/t/p/w342/7MlFaVh9ijUlWuEYV8PfFU3i4of.jpg
tt2386490	How to Train Your Dragon: The Hidden World	https://image.tmdb.org/t/p/w342/xvx4Yhf0DVH8G4LzNISpMfFBDy2.jpg
tt9806192	I Lost My Body	https://image.tmdb.org/t/p/w342/z5dXCywyo8zEPNDkeQY7nbvkrz8.jpg
tt4729430	Klaus	https://image.tmdb.org/t/p/w342/q125RHUDgR4gjwh1QkfYuJLYkL.jpg
tt6348138	Missing Link	https://image.tmdb.org/t/p/w342/gEkKHiiQRVUSX15Iwo8VFydXrtu.jpg
tt1979376	Toy Story 4	https://image.tmdb.org/t/p/w342/w9kR8qbmQ01HwnvK4alvnQ2ca0L.jpg
tt4154796	Avengers: Endgame	https://image.tmdb.org/t/p/w342/or06FN3Dka5tukK1e9sl16pB3iy.jpg
tt6105098	The Lion King	https://image.tmdb.org/t/p/w342/dzBtMocZuJbjLOXvrl4zGYigDzh.jpg
tt9464764	In the Absence	https://image.tmdb.org/t/p/w342/7VQ6eu8U7Dp8FaD71USIxk9yQ4Y.jpg
tt10397932	Learning to Skateboard in a Warzone (If You're a Girl)	https://image.tmdb.org/t/p/w342/fhTGumzgP0p6IaKfTWqBMu21lsW.jpg
tt9204606	Life Overtakes Me	https://image.tmdb.org/t/p/w342/uv4a1MntQA8pydnTTf3iICEFcHB.jpg
tt10009148	St. Louis Superman	https://image.tmdb.org/t/p/w342/qV4eTXHQSumCDbJzEJizoBFR6Pe.jpg
tt10182854	Walk Run Cha-Cha	https://image.tmdb.org/t/p/w342/tvsqaTjSkLyYiZbWd769UvPszT6.jpg
tt8767544	A Sister	https://image.tmdb.org/t/p/w342/xtrSb61G0x8wALUNlEFjGPsECgq.jpg
tt8906678	Brotherhood	https://image.tmdb.org/t/p/w342/wiQeUsihG4gWOh3uAHxzAZqSPrQ.jpg
tt8551848	Nefta Football Club	https://image.tmdb.org/t/p/w342/wRa0zStfGUA345pdz4h2E3OxNzP.jpg
tt11421246	Saria	https://image.tmdb.org/t/p/w342/qUtMBksjjJLM4Eid2fm5oTUWck2.jpg
tt8163822	The Neighbors' Window	https://image.tmdb.org/t/p/w342/gZJmwQTaUf5iJzcENxtqPa9uxBg.jpg
tt8946378	Knives Out	https://image.tmdb.org/t/p/w342/pThyQovXQrw2m0s9x82twj48Jq4.jpg
tt7984734	The Lighthouse	https://image.tmdb.org/t/p/w342/3nk9UoepYmv1G9oP18q6JJCeYwN.jpg
tt7083526	Breakthrough	https://image.tmdb.org/t/p/w342/85BfZAYh4zC1U6NBz2ZkXb3y67v.jpg
tt4520988	Frozen II	https://image.tmdb.org/t/p/w342/mINJaa34MtknCYl5AjtNJzWj8cD.jpg
tt4648786	Harriet	https://image.tmdb.org/t/p/w342/rsUs58bDqpJJxZSOebZOMN9gzw2.jpg
tt2066051	Rocketman	https://image.tmdb.org/t/p/w342/f4FF18ia7yTvHf2izNrHqBmgH8U.jpg
tt4995540	Being the Ricardos	https://image.tmdb.org/t/p/w342/oztBLWdRk5gApYmNdADXvXkLT5m.jpg
tt10293406	The Power of the Dog	https://image.tmdb.org/t/p/w342/kEy48iCzGnp0ao1cZbNeWR6yIhC.jpg
tt8721424	tick, tick… BOOM!	https://image.tmdb.org/t/p/w342/DPmfcuR8fh8ROYXgdjrAjSGA0o.jpg
tt9620288	King Richard	https://image.tmdb.org/t/p/w342/vjpMd1dsEsVBoUhq6iVHXwwFj9n.jpg
tt10095582	The Tragedy of Macbeth	https://image.tmdb.org/t/p/w342/eWnDaPkOe0ISpkDgwnfidQoMfX2.jpg
tt12789558	Belfast	https://image.tmdb.org/t/p/w342/3mInLZyPOVLsZRsBwNHi3UJXXnm.jpg
tt10366460	CODA	https://image.tmdb.org/t/p/w342/BzVjmm8l23rPsijLiNLUzuQtyd.jpg
tt9115530	The Eyes of Tammy Faye	https://image.tmdb.org/t/p/w342/yL3IAfOxUH7h1Og9kxG3czxa4XV.jpg
tt9100054	The Lost Daughter	https://image.tmdb.org/t/p/w342/t1oLNRFixpFOVsyz1HCqCUW3wiW.jpg
tt12536294	Spencer	https://image.tmdb.org/t/p/w342/7GcqdBKaMM9BWXWN07BirBMkcBF.jpg
tt2953050	Encanto	https://image.tmdb.org/t/p/w342/4j0PNHkMr5ax3IA8tjtxcmPU3QT.jpg
tt8430054	Flee	https://image.tmdb.org/t/p/w342/xFt46rDzFHl1Oo1RHEEB06sz4Mk.jpg
tt7979580	The Mitchells vs. the Machines	https://image.tmdb.org/t/p/w342/mI2Di7HmskQQ34kz0iau6J1vr70.jpg
tt5109280	Raya and the Last Dragon	https://image.tmdb.org/t/p/w342/lPsD10PP4rgUGiGR4CCXA6iY0QQ.jpg
tt1160419	Dune	https://image.tmdb.org/t/p/w342/d5NXSklXo0qyIYkgV94XAgMIckC.jpg
tt7740496	Nightmare Alley	https://image.tmdb.org/t/p/w342/680klE0dIreQQOyWKFgNnCAJtws.jpg
tt3228774	Cruella	https://image.tmdb.org/t/p/w342/wToO8opxkGwKgSfJ1JK8tGvkG6U.jpg
tt12889404	Cyrano	https://image.tmdb.org/t/p/w342/e4koV8iC2cCM57bqUnEnIL2a2zH.jpg
tt14039582	Drive My Car	https://image.tmdb.org/t/p/w342/xlEnJ6O2xIlcJPvo23PWUiiSS21.jpg
tt11271038	Licorice Pizza	https://image.tmdb.org/t/p/w342/jD98aUKHQZNAmrk0wQQ9wmNQPnP.jpg
tt12482898	Attica	https://image.tmdb.org/t/p/w342/8dpc49O7G9B0y2crRbI7hHtbQzB.jpg
tt11422728	Summer of Soul (...or, When the Revolution Could Not Be Televised)	https://image.tmdb.org/t/p/w342/8kNwhqUGvpzWJd60O1Qvb8G6psK.jpg
tt13630174	Writing With Fire	https://image.tmdb.org/t/p/w342/O7cmXnEEAVioEQ1JdRl9iss5vQ.jpg
tt12771540	Audible	https://image.tmdb.org/t/p/w342/9oslTRMKWpdg96pvLRFogXh516x.jpg
tt15339848	Lead Me Home	https://image.tmdb.org/t/p/w342/cnAF0z3HOnVAccQjAs9v5U4pTe7.jpg
tt14513236	The Queen of Basketball	https://image.tmdb.org/t/p/w342/zgEDo7dlDoy9jHmcUUsDbSUnrzQ.jpg
tt14608922	Three Songs for Benazir	https://image.tmdb.org/t/p/w342/4lx97S0N0hh8k1r5mH9dF755D7b.jpg
tt13796488	When We Were Bullies	https://image.tmdb.org/t/p/w342/ouBlJ9H3wYDE7KpuDkraXYgt5A2.jpg
tt11286314	Don't Look Up	https://image.tmdb.org/t/p/w342/th4E1yqsE8DGpAseLiUrI60Hf8V.jpg
tt12680684	The Hand of God	https://image.tmdb.org/t/p/w342/kreVxr5moB7K52IGGV1BGAn6nq1.jpg
tt10189300	Lunana: A Yak in the Classroom	https://image.tmdb.org/t/p/w342/a9pbzwo6WND1o6UJioRoUcAcat4.jpg
tt10370710	The Worst Person in the World	https://image.tmdb.org/t/p/w342/4dF5NT1dxw4CItns4ckXq4309bg.jpg
tt6802400	Coming 2 America	https://image.tmdb.org/t/p/w342/nWBPLkqNApY5pgrJFMiI9joSI30.jpg
tt11214590	House of Gucci	https://image.tmdb.org/t/p/w342/vHla3Ej2m53rNmvmYkzvennLrKn.jpg
tt12618926	Parallel Mothers	https://image.tmdb.org/t/p/w342/gDaxYkYNbHuM2VlUazbcpnFZB6d.jpg
tt2382320	No Time to Die	https://image.tmdb.org/t/p/w342/iUgygt3fscRoKWCV1d0C7FbM9TP.jpg
tt10344522	Four Good Days	https://image.tmdb.org/t/p/w342/uaJmqZxwAsdFLLjPGH5DzIEnbpj.jpg
tt14293560	Affairs of the Art	https://image.tmdb.org/t/p/w342/5vWn23tb9AYbhvpJMUrBLHIoUNn.jpg
tt13333898	The Beast	https://image.tmdb.org/t/p/w342/5YnnuENEnhbzdHJWOx3jEescF5E.jpg
tt14825972	BoxBallet	https://image.tmdb.org/t/p/w342/itMGtzYChYodWjZ1mBs5EPCDqPP.jpg
tt11332850	Robin Robin	https://image.tmdb.org/t/p/w342/bKIdlJbd17rrIm4oZzhXTbmqpon.jpg
tt9464038	The Windshield Wiper	https://image.tmdb.org/t/p/w342/hkfe9DfheH7zRu8Yj2wXqukbrTx.jpg
tt7914938	Take and Run	https://image.tmdb.org/t/p/w342/24995XT20z34m090bQs2DwSGrIe.jpg
tt11924384	The Long Goodbye	https://image.tmdb.org/t/p/w342/etLOhBuFUszVxxWlbyWo5WT7HoC.jpg
tt15289736	On My Mind	https://image.tmdb.org/t/p/w342/3nDI3UCxdJrOo2jsT6gokFhfnDe.jpg
tt11383280	Please Hold	https://image.tmdb.org/t/p/w342/zHtMFz4o55ZJbCvNwwqUz36aDpv.jpg
tt6264654	Free Guy	https://image.tmdb.org/t/p/w342/xmbU4JTUm8rsdtn7Y3Fcm30GpeT.jpg
tt10872600	Spider-Man: No Way Home	https://image.tmdb.org/t/p/w342/1g0dhYtq4irTY1GPXvft6k4YLjm.jpg
tt3581652	West Side Story	https://image.tmdb.org/t/p/w342/zeAZTPxV5xZRNEX3rZotnsp7IVo.jpg
tt12801262	Luca	https://image.tmdb.org/t/p/w342/jTswp6KyDYKtvC52GbHagrZbGvD.jpg
tt14505430	Ascension	https://image.tmdb.org/t/p/w342/8Tng4QWveeazE2gFcrZxvbyvvl8.jpg
tt12299764	The Dress	https://image.tmdb.org/t/p/w342/kgi1xFDbsLmeHfVRVtuHgYr1qj3.jpg
tt9376612	Shang-Chi and the Legend of the Ten Rings	https://image.tmdb.org/t/p/w342/1BIoJGKbXjdFDAqUEiA2VHqkK1Z.jpg
\.


--
-- Data for Name: groups; Type: TABLE DATA; Schema: public; Owner: perenstrom
--

COPY public.groups (id) FROM stdin;
4
\.


--
-- Data for Name: years; Type: TABLE DATA; Schema: public; Owner: perenstrom
--

COPY public.years (year, name, date, betting_open) FROM stdin;
2021	93rd Academy Awards	2021-04-26	f
2020	92nd Academy Awards	2020-02-10	f
2022	94th Academy Awards	2022-03-27	f
\.


--
-- Data for Name: nominations; Type: TABLE DATA; Schema: public; Owner: perenstrom
--

COPY public.nominations (id, year_id, category_id, nominee, won, decided, film_id) FROM stdin;
1	2021	best-picture	\N	t	t	tt9770150
4	2021	best-picture	\N	f	t	tt10272386
5	2021	best-picture	\N	f	t	tt9784798
6	2021	best-picture	\N	f	t	tt10618286
7	2021	best-picture	\N	f	t	tt10633456
8	2021	best-picture	\N	f	t	tt9620292
9	2021	best-picture	\N	f	t	tt5363618
10	2021	best-picture	\N	f	t	tt1070874
11	2021	best-supporting-actress	Maria Bakalova	f	t	tt13143964
12	2021	best-supporting-actress	Glenn Close	f	t	tt6772802
13	2021	best-supporting-actress	Olivia Colman	f	t	tt10272386
14	2021	best-supporting-actress	Amanda Seyfried	f	t	tt10618286
15	2021	best-supporting-actress	Yuh-Jung Youn	t	t	tt10633456
16	2021	best-costume	\N	f	t	tt9214832
17	2021	best-costume	\N	t	t	tt10514222
18	2021	best-costume	\N	f	t	tt10618286
19	2021	best-costume	\N	f	t	tt4566758
20	2021	best-costume	\N	f	t	tt8333746
21	2021	best-original-score	\N	f	t	tt9777644
22	2021	best-original-score	\N	f	t	tt10618286
23	2021	best-original-score	\N	f	t	tt10633456
24	2021	best-original-score	\N	f	t	tt6878306
25	2021	best-original-score	\N	t	t	tt2948372
26	2021	best-adapted-screenplay	\N	f	t	tt13143964
27	2021	best-adapted-screenplay	\N	t	t	tt10272386
28	2021	best-adapted-screenplay	\N	f	t	tt9770150
29	2021	best-adapted-screenplay	\N	f	t	tt10612922
30	2021	best-adapted-screenplay	\N	f	t	tt6571548
31	2021	best-original-screenplay	\N	f	t	tt9784798
32	2021	best-original-screenplay	\N	f	t	tt10633456
33	2021	best-original-screenplay	\N	t	t	tt9620292
34	2021	best-original-screenplay	\N	f	t	tt5363618
35	2021	best-original-screenplay	\N	f	t	tt1070874
36	2021	best-animated-short	\N	f	t	tt13167288
37	2021	best-animated-short	\N	f	t	tt11884670
38	2021	best-animated-short	\N	t	t	tt11768948
39	2021	best-animated-short	\N	f	t	tt14039636
40	2021	best-animated-short	\N	f	t	tt12706728
41	2021	best-live-action-short	\N	f	t	tt9280166
42	2021	best-live-action-short	\N	f	t	tt11962160
43	2021	best-live-action-short	\N	f	t	tt11474480
44	2021	best-live-action-short	\N	t	t	tt13472984
45	2021	best-live-action-short	\N	f	t	tt10538710
46	2021	best-supporting-actor	Sacha Baron Cohen	f	t	tt1070874
47	2021	best-supporting-actor	Daniel Kaluuya	t	t	tt9784798
48	2021	best-supporting-actor	Leslie Odom, Jr.	f	t	tt10612922
49	2021	best-supporting-actor	Paul Raci	f	t	tt5363618
50	2021	best-supporting-actor	Lakeith Stanfield	f	t	tt9784798
51	2021	best-documentary	\N	f	t	tt10706602
52	2021	best-documentary	\N	f	t	tt8923484
53	2021	best-documentary	\N	f	t	tt11394298
54	2021	best-documentary	\N	t	t	tt12888462
55	2021	best-documentary	\N	f	t	tt11416746
56	2021	best-documentary-short	\N	t	t	tt11643154
57	2021	best-documentary-short	\N	f	t	tt13793326
58	2021	best-documentary-short	\N	f	t	tt11512676
59	2021	best-documentary-short	\N	f	t	tt12979636
60	2021	best-documentary-short	\N	f	t	tt8993180
61	2021	best-international-film	Denmark	t	t	tt10288566
62	2021	best-international-film	Hong Kong	f	t	tt9586294
63	2021	best-international-film	Romania	f	t	tt10706602
64	2021	best-international-film	Tunisia	f	t	tt10360862
65	2021	best-international-film	Bosnia and Herzegovina	f	t	tt8633462
66	2021	best-sound	\N	f	t	tt6048922
67	2021	best-sound	\N	f	t	tt10618286
68	2021	best-sound	\N	f	t	tt6878306
69	2021	best-sound	\N	f	t	tt2948372
70	2021	best-sound	\N	t	t	tt5363618
71	2021	best-production-design	\N	f	t	tt10272386
72	2021	best-production-design	\N	f	t	tt10514222
73	2021	best-production-design	\N	t	t	tt10618286
74	2021	best-production-design	\N	f	t	tt6878306
75	2021	best-production-design	\N	f	t	tt6723592
76	2021	best-editing	\N	f	t	tt10272386
77	2021	best-editing	\N	f	t	tt9770150
78	2021	best-editing	\N	f	t	tt9620292
79	2021	best-editing	\N	t	t	tt5363618
80	2021	best-editing	\N	f	t	tt1070874
81	2021	best-cinematography	\N	f	t	tt9784798
82	2021	best-cinematography	\N	t	t	tt10618286
83	2021	best-cinematography	\N	f	t	tt6878306
84	2021	best-cinematography	\N	f	t	tt9770150
85	2021	best-cinematography	\N	f	t	tt1070874
86	2021	best-visual-effects	\N	f	t	tt2222042
87	2021	best-visual-effects	\N	f	t	tt10539608
88	2021	best-visual-effects	\N	f	t	tt3661394
89	2021	best-visual-effects	\N	f	t	tt4566758
90	2021	best-visual-effects	\N	t	t	tt6723592
91	2021	best-hair-and-makeup	\N	f	t	tt9214832
92	2021	best-hair-and-makeup	\N	f	t	tt6772802
93	2021	best-hair-and-makeup	\N	t	t	tt10514222
94	2021	best-hair-and-makeup	\N	f	t	tt10618286
95	2021	best-hair-and-makeup	\N	f	t	tt8333746
96	2021	best-animated-feature	\N	f	t	tt7146812
97	2021	best-animated-feature	\N	f	t	tt7488208
98	2021	best-animated-feature	\N	f	t	tt6193408
99	2021	best-animated-feature	\N	t	t	tt2948372
100	2021	best-animated-feature	\N	f	t	tt5198068
101	2021	best-original-song	Fight For You	t	t	tt9784798
102	2021	best-original-song	Hear My Voice	f	t	tt1070874
103	2021	best-original-song	Husavik	f	t	tt8580274
104	2021	best-original-song	Io Sì (Seen)	f	t	tt10627584
105	2021	best-original-song	Speak Now	f	t	tt10612922
106	2021	best-actor	Riz Ahmed	f	t	tt5363618
107	2021	best-actor	Chadwick Boseman	f	t	tt10514222
108	2021	best-actor	Anthony Hopkins	t	t	tt10272386
109	2021	best-actor	Gary Oldman	f	t	tt10618286
110	2021	best-actor	Steven Yeun	f	t	tt10633456
322	2022	best-picture	\N	f	t	tt12789558
111	2021	best-actress	Viola Davis	f	t	tt10514222
112	2021	best-actress	Andra Day	f	t	tt8521718
113	2021	best-actress	Vanessa Kirby	f	t	tt11161474
114	2021	best-actress	Frances McDormand	t	t	tt9770150
115	2021	best-actress	Carey Mulligan	f	t	tt9620292
116	2021	best-director	Thomas Vinterberg	f	t	tt10288566
117	2021	best-director	David Fincher	f	t	tt10618286
118	2021	best-director	Lee Isaac Chung	f	t	tt10633456
119	2021	best-director	Chloè Zhao	t	t	tt9770150
120	2021	best-director	Emerald Fennell	f	t	tt9620292
123	2020	best-supporting-actor	Tom Hanks	f	t	tt3224458
124	2020	best-supporting-actor	Brad Pitt	t	t	tt7131622
125	2020	best-supporting-actor	Al Pacino	f	t	tt1302006
126	2020	best-supporting-actor	Joe Pesci	f	t	tt1302006
127	2020	best-supporting-actor	Anthony Hopkins	f	t	tt8404614
128	2020	best-hair-and-makeup	\N	f	t	tt8579674
129	2020	best-hair-and-makeup	\N	t	t	tt6394270
130	2020	best-hair-and-makeup	\N	f	t	tt7286456
131	2020	best-hair-and-makeup	\N	f	t	tt7549996
132	2020	best-hair-and-makeup	\N	f	t	tt4777008
133	2020	best-costume	\N	f	t	tt2584384
134	2020	best-costume	\N	f	t	tt7286456
135	2020	best-costume	\N	t	t	tt3281548
136	2020	best-costume	\N	f	t	tt7131622
137	2020	best-costume	\N	f	t	tt1302006
138	2020	best-documentary	\N	t	t	tt9351980
139	2020	best-documentary	\N	f	t	tt9617456
140	2020	best-documentary	\N	f	t	tt8991268
141	2020	best-documentary	\N	f	t	tt7178226
142	2020	best-documentary	\N	f	t	tt6016744
143	2020	best-sound-editing	\N	f	t	tt8579674
144	2020	best-sound-editing	\N	t	t	tt1950186
145	2020	best-sound-editing	\N	f	t	tt7286456
146	2020	best-sound-editing	\N	f	t	tt7131622
147	2020	best-sound-editing	\N	f	t	tt2527338
148	2020	best-sound-mixing	\N	t	t	tt8579674
149	2020	best-sound-mixing	\N	f	t	tt2935510
150	2020	best-sound-mixing	\N	f	t	tt1950186
151	2020	best-sound-mixing	\N	f	t	tt7286456
152	2020	best-sound-mixing	\N	f	t	tt7131622
153	2020	best-production-design	\N	f	t	tt8579674
154	2020	best-production-design	\N	f	t	tt2584384
155	2020	best-production-design	\N	t	t	tt7131622
156	2020	best-production-design	\N	f	t	tt6751668
157	2020	best-production-design	\N	f	t	tt1302006
158	2020	best-international-film	Poland	f	t	tt8649186
159	2020	best-international-film	North Macedonia	f	t	tt8991268
160	2020	best-international-film	France	f	t	tt10199590
161	2020	best-international-film	Spain	f	t	tt8291806
162	2020	best-international-film	South Korea	t	t	tt6751668
163	2020	best-supporting-actress	Margot Robbie	f	t	tt6394270
164	2020	best-supporting-actress	Scarlet Johansen	f	t	tt2584384
165	2020	best-supporting-actress	Florence Pugh	f	t	tt3281548
166	2020	best-supporting-actress	Laura Dern	t	t	tt7653254
167	2020	best-supporting-actress	Kathy Bates	f	t	tt3513548
168	2020	best-animated-short	\N	f	t	tt10923134
169	2020	best-animated-short	\N	t	t	tt7129636
170	2020	best-animated-short	\N	f	t	tt9536832
171	2020	best-animated-short	\N	f	t	tt10499942
172	2020	best-animated-short	\N	f	t	tt9032798
173	2020	best-animated-feature	\N	f	t	tt2386490
174	2020	best-animated-feature	\N	f	t	tt9806192
175	2020	best-animated-feature	\N	f	t	tt4729430
176	2020	best-animated-feature	\N	f	t	tt6348138
177	2020	best-animated-feature	\N	t	t	tt1979376
178	2020	best-visual-effects	\N	t	t	tt8579674
179	2020	best-visual-effects	\N	f	t	tt4154796
180	2020	best-visual-effects	\N	f	t	tt2527338
181	2020	best-visual-effects	\N	f	t	tt1302006
182	2020	best-visual-effects	\N	f	t	tt6105098
183	2020	best-editing	\N	t	t	tt1950186
184	2020	best-editing	\N	f	t	tt2584384
185	2020	best-editing	\N	f	t	tt7286456
186	2020	best-editing	\N	f	t	tt6751668
187	2020	best-editing	\N	f	t	tt1302006
188	2020	best-documentary-short	\N	f	t	tt9464764
189	2020	best-documentary-short	\N	t	t	tt10397932
190	2020	best-documentary-short	\N	f	t	tt9204606
191	2020	best-documentary-short	\N	f	t	tt10009148
192	2020	best-documentary-short	\N	f	t	tt10182854
193	2020	best-live-action-short	\N	f	t	tt8767544
194	2020	best-live-action-short	\N	f	t	tt8906678
195	2020	best-live-action-short	\N	f	t	tt8551848
196	2020	best-live-action-short	\N	f	t	tt11421246
197	2020	best-live-action-short	\N	t	t	tt8163822
198	2020	best-adapted-screenplay	Taika Waititi	t	t	tt2584384
199	2020	best-adapted-screenplay	Todd Phillips, Scott Silver	f	t	tt7286456
200	2020	best-adapted-screenplay	Greta Gerwig	f	t	tt3281548
201	2020	best-adapted-screenplay	Steven Zaillian	f	t	tt1302006
202	2020	best-adapted-screenplay	Anthony McCarten	f	t	tt8404614
203	2020	best-original-screenplay	Sam Mendes, Kryst Wilson-Cairns	f	t	tt8579674
204	2020	best-original-screenplay	Rian Johnson	f	t	tt8946378
205	2020	best-original-screenplay	Noah Baumbach	f	t	tt7653254
206	2020	best-original-screenplay	Quentin Tarantino	f	t	tt7131622
207	2020	best-original-screenplay	Bong Joon Ho, Han Jin Won	t	t	tt6751668
208	2020	best-cinematography	Roger Deakins	t	t	tt8579674
209	2020	best-cinematography	Lawrence Sher	f	t	tt7286456
210	2020	best-cinematography	Robert Richardson	f	t	tt7131622
211	2020	best-cinematography	Rodrigo Prieto	f	t	tt1302006
212	2020	best-cinematography	Jarin Blaschke	f	t	tt7984734
213	2020	best-original-score	\N	f	t	tt8579674
214	2020	best-original-score	\N	t	t	tt7286456
215	2020	best-original-score	\N	f	t	tt3281548
216	2020	best-original-score	\N	f	t	tt7653254
217	2020	best-original-score	\N	f	t	tt2527338
218	2020	best-original-song	I'm Standing With You	f	t	tt7083526
219	2020	best-original-song	Into the Unknown	f	t	tt4520988
220	2020	best-original-song	Stand Up	f	t	tt4648786
221	2020	best-original-song	(I'm Gonna) Love Me Again	t	t	tt2066051
222	2020	best-original-song	I Can't Let You Throw Yourself Away	f	t	tt1979376
223	2020	best-director	Sam Mendes	f	t	tt8579674
224	2020	best-director	Todd Philips	f	t	tt7286456
225	2020	best-director	Quentin Tarantino	f	t	tt7131622
226	2020	best-director	Bong Joon Ho	t	t	tt6751668
227	2020	best-director	Martin Scorsese	f	t	tt1302006
228	2020	best-actor	Joaquin Phoenix	t	t	tt7286456
229	2020	best-actor	Adam Driver	f	t	tt7653254
230	2020	best-actor	Leonardi DiCaprio	f	t	tt7131622
231	2020	best-actor	Antonio Banderas	f	t	tt8291806
232	2020	best-actor	Jonathan Pryce	f	t	tt8404614
233	2020	best-actress	Charlize Theron	f	t	tt6394270
234	2020	best-actress	Cynthia Erivo	f	t	tt4648786
235	2020	best-actress	Renee Zellweger	t	t	tt7549996
236	2020	best-actress	Saoirse Ronan	f	t	tt3281548
237	2020	best-actress	Scarlet Johansen	f	t	tt7653254
238	2020	best-picture	\N	f	t	tt8579674
239	2020	best-picture	\N	f	t	tt1950186
240	2020	best-picture	\N	f	t	tt2584384
241	2020	best-picture	\N	f	t	tt7286456
242	2020	best-picture	\N	f	t	tt3281548
243	2020	best-picture	\N	f	t	tt7653254
244	2020	best-picture	\N	f	t	tt7131622
245	2020	best-picture	\N	t	t	tt6751668
246	2020	best-picture	\N	f	t	tt1302006
247	2022	best-actor	Javier Bardem	f	t	tt4995540
248	2022	best-actor	Benedict Cumberbatch	f	t	tt10293406
249	2022	best-actor	Andrew Garfield	f	t	tt8721424
250	2022	best-actor	Will Smith	t	t	tt9620288
251	2022	best-actor	Denzel Washington	f	t	tt10095582
252	2022	best-supporting-actor	Ciarán Hinds	f	t	tt12789558
253	2022	best-supporting-actor	Troy Kotsur	t	t	tt10366460
254	2022	best-supporting-actor	Jesse Plemons	f	t	tt10293406
255	2022	best-supporting-actor	J.K. Simmons	f	t	tt4995540
256	2022	best-supporting-actor	Kodi Smit-McPhee	f	t	tt10293406
257	2022	best-actress	Jessica Chastain	t	t	tt9115530
258	2022	best-actress	Olivia Colman	f	t	tt9100054
259	2022	best-actress	Penélope Cruz	f	t	tt12618926
260	2022	best-actress	Nicole Kidman	f	t	tt4995540
261	2022	best-actress	Kristen Stewart	f	t	tt12536294
262	2022	best-supporting-actress	Jessie Buckley	f	t	tt9100054
263	2022	best-supporting-actress	Ariana Debose	t	t	tt3581652
264	2022	best-supporting-actress	Judi Dench	f	t	tt12789558
265	2022	best-supporting-actress	Kirsten Dunst	f	t	tt10293406
266	2022	best-supporting-actress	Aunjanue Ellis	f	t	tt9620288
267	2022	best-animated-feature	\N	t	t	tt2953050
268	2022	best-animated-feature	\N	f	t	tt8430054
269	2022	best-animated-feature	\N	f	t	tt12801262
270	2022	best-animated-feature	\N	f	t	tt7979580
271	2022	best-animated-feature	\N	f	t	tt5109280
272	2022	best-cinematography	Greig Fraser	t	t	tt1160419
273	2022	best-cinematography	Dan Laustsen	f	t	tt7740496
274	2022	best-cinematography	Ari Wegner	f	t	tt10293406
275	2022	best-cinematography	Bruno Delbonnel	f	t	tt10095582
276	2022	best-cinematography	Janusz Kaminski	f	t	tt3581652
277	2022	best-costume	\N	t	t	tt3228774
278	2022	best-costume	\N	f	t	tt12889404
279	2022	best-costume	\N	f	t	tt1160419
280	2022	best-costume	\N	f	t	tt7740496
281	2022	best-costume	\N	f	t	tt3581652
282	2022	best-director	Kenneth Branagh	f	t	tt12789558
283	2022	best-director	Ryusuke Hamaguchi	f	t	tt14039582
284	2022	best-director	Paul Thomas Anderson	f	t	tt11271038
285	2022	best-director	Jane Campion	t	t	tt10293406
286	2022	best-director	Steven Spielberg	f	t	tt3581652
287	2022	best-documentary	\N	f	t	tt14505430
288	2022	best-documentary	\N	f	t	tt12482898
289	2022	best-documentary	\N	f	t	tt8430054
290	2022	best-documentary	\N	t	t	tt11422728
291	2022	best-documentary	\N	f	t	tt13630174
292	2022	best-documentary-short	\N	f	t	tt12771540
293	2022	best-documentary-short	\N	f	t	tt15339848
294	2022	best-documentary-short	\N	t	t	tt14513236
295	2022	best-documentary-short	\N	f	t	tt14608922
296	2022	best-documentary-short	\N	f	t	tt13796488
297	2022	best-editing	\N	f	t	tt11286314
298	2022	best-editing	\N	t	t	tt1160419
299	2022	best-editing	\N	f	t	tt9620288
300	2022	best-editing	\N	f	t	tt10293406
301	2022	best-editing	\N	f	t	tt8721424
302	2022	best-international-film	Japan	t	t	tt14039582
303	2022	best-international-film	Denmark	f	t	tt8430054
304	2022	best-international-film	Italy	f	t	tt12680684
305	2022	best-international-film	Bhutan	f	t	tt10189300
306	2022	best-international-film	Norway	f	t	tt10370710
307	2022	best-hair-and-makeup	\N	f	t	tt6802400
308	2022	best-hair-and-makeup	\N	f	t	tt3228774
309	2022	best-hair-and-makeup	\N	f	t	tt1160419
310	2022	best-hair-and-makeup	\N	t	t	tt9115530
311	2022	best-hair-and-makeup	\N	f	t	tt11214590
312	2022	best-original-score	\N	f	t	tt11286314
313	2022	best-original-score	\N	t	t	tt1160419
314	2022	best-original-score	\N	f	t	tt2953050
315	2022	best-original-score	\N	f	t	tt12618926
316	2022	best-original-score	\N	f	t	tt10293406
317	2022	best-original-song	Be Alive	f	t	tt9620288
318	2022	best-original-song	Dos Oruguitas	f	t	tt2953050
319	2022	best-original-song	Down to Joy	f	t	tt12789558
320	2022	best-original-song	No Time to Die	t	t	tt2382320
321	2022	best-original-song	Somehow You Do	f	t	tt10344522
323	2022	best-picture	\N	t	t	tt10366460
324	2022	best-picture	\N	f	t	tt11286314
325	2022	best-picture	\N	f	t	tt14039582
326	2022	best-picture	\N	f	t	tt1160419
327	2022	best-picture	\N	f	t	tt9620288
328	2022	best-picture	\N	f	t	tt11271038
329	2022	best-picture	\N	f	t	tt7740496
330	2022	best-picture	\N	f	t	tt10293406
331	2022	best-picture	\N	f	t	tt3581652
332	2022	best-production-design	\N	t	t	tt1160419
333	2022	best-production-design	\N	f	t	tt7740496
334	2022	best-production-design	\N	f	t	tt10293406
335	2022	best-production-design	\N	f	t	tt10095582
336	2022	best-production-design	\N	f	t	tt3581652
337	2022	best-animated-short	\N	f	t	tt14293560
338	2022	best-animated-short	\N	f	t	tt13333898
339	2022	best-animated-short	\N	f	t	tt14825972
340	2022	best-animated-short	\N	f	t	tt11332850
341	2022	best-animated-short	\N	t	t	tt9464038
342	2022	best-live-action-short	\N	f	t	tt7914938
343	2022	best-live-action-short	\N	f	t	tt12299764
344	2022	best-live-action-short	\N	t	t	tt11924384
345	2022	best-live-action-short	\N	f	t	tt15289736
346	2022	best-live-action-short	\N	f	t	tt11383280
347	2022	best-sound	\N	f	t	tt12789558
348	2022	best-sound	\N	t	t	tt1160419
349	2022	best-sound	\N	f	t	tt2382320
350	2022	best-sound	\N	f	t	tt10293406
351	2022	best-sound	\N	f	t	tt3581652
352	2022	best-visual-effects	\N	t	t	tt1160419
353	2022	best-visual-effects	\N	f	t	tt6264654
354	2022	best-visual-effects	\N	f	t	tt2382320
355	2022	best-visual-effects	\N	f	t	tt9376612
356	2022	best-visual-effects	\N	f	t	tt10872600
357	2022	best-adapted-screenplay	Siân Heder	t	t	tt10366460
358	2022	best-adapted-screenplay	Ryusuke Hamaguchi, Takamasa Oe	f	t	tt14039582
359	2022	best-adapted-screenplay	Jon Spaihts, Denis Villeneuve, Eric Roth	f	t	tt1160419
360	2022	best-adapted-screenplay	Maggie Gyllenhaal	f	t	tt9100054
361	2022	best-adapted-screenplay	Jane Campion	f	t	tt10293406
362	2022	best-original-screenplay	Kenneth Branagh	t	t	tt12789558
363	2022	best-original-screenplay	Adam McKay, David Sirota	f	t	tt11286314
364	2022	best-original-screenplay	Zach Baylin	f	t	tt9620288
365	2022	best-original-screenplay	Paul Thomas Anderson	f	t	tt11271038
366	2022	best-original-screenplay	Eskil Vogt, Joachim Trier	f	t	tt10370710
\.


--
-- Data for Name: players; Type: TABLE DATA; Schema: public; Owner: perenstrom
--

COPY public.players (id, name, auth0_user_id, group_id) FROM stdin;
1	Per	auth0|609ad898c4cd5a0069719940	4
4	Jobjörn	auth0|60e84251affb99006a5ac43a	4
5	Henrik	auth0|61cac1451c2b8d0069de223c	4
6	Staffan	auth0|6221192a8568200070b71e00	4
8	Leo	auth0|6202d4d6052e86006801bf6e	4
9	Hedvig	auth0|6202c4dd4b45f10068156520	4
10	Rozbe	\N	4
12	Lena	auth0|620d4d8b13fe360068984ebd	4
\.


--
-- Data for Name: bets; Type: TABLE DATA; Schema: public; Owner: perenstrom
--

COPY public.bets (id, nomination_id, player_id) FROM stdin;
69	1	1
120	15	1
77	17	1
73	25	1
124	28	1
79	33	1
134	38	1
135	44	1
72	47	1
122	54	1
136	56	1
71	61	1
68	70	1
74	73	1
121	80	1
67	84	1
75	90	1
70	93	1
125	100	1
78	105	1
76	107	1
123	115	1
80	119	1
235	124	1
242	129	1
249	135	1
256	139	1
263	144	1
270	150	1
277	153	1
284	162	1
291	166	1
298	169	1
305	177	1
312	178	1
319	183	1
326	189	1
333	194	1
340	200	1
347	207	1
354	208	1
361	214	1
368	221	1
375	223	1
382	228	1
389	235	1
396	238	1
412	250	1
413	256	1
434	257	1
440	265	1
442	267	1
446	274	1
408	277	1
444	285	1
445	290	1
460	292	1
441	298	1
447	302	1
437	309	1
438	313	1
448	317	1
416	330	1
439	333	1
457	340	1
459	342	1
435	348	1
415	352	1
436	361	1
443	365	1
114	1	4
108	13	4
140	17	4
110	25	4
116	28	4
142	33	4
115	38	4
139	44	4
111	47	4
105	51	4
141	60	4
112	61	4
117	70	4
109	73	4
138	79	4
118	84	4
151	90	4
113	93	4
103	99	4
104	105	4
137	107	4
119	114	4
143	119	4
236	124	4
243	128	4
250	135	4
257	139	4
264	143	4
271	150	4
278	153	4
285	162	4
292	164	4
299	168	4
306	175	4
313	180	4
320	183	4
327	189	4
334	193	4
341	200	4
348	207	4
355	208	4
362	213	4
369	219	4
376	226	4
383	231	4
390	237	4
397	245	4
488	251	4
483	255	4
475	258	4
486	265	4
490	267	4
476	272	4
493	281	4
498	282	4
499	290	4
496	296	4
489	300	4
482	302	4
481	311	4
484	314	4
495	318	4
480	330	4
485	332	4
479	341	4
491	346	4
477	347	4
487	352	4
478	361	4
497	365	4
234	1	5
167	15	5
159	17	5
162	25	5
158	28	5
160	33	5
166	39	5
168	44	5
164	47	5
149	54	5
147	57	5
165	61	5
154	70	5
163	73	5
156	80	5
155	84	5
161	90	5
157	93	5
152	99	5
146	103	5
153	107	5
233	115	5
148	119	5
237	124	5
244	129	5
251	135	5
258	139	5
265	144	5
272	150	5
279	153	5
286	162	5
293	166	5
300	171	5
307	175	5
314	178	5
321	183	5
328	189	5
335	197	5
342	200	5
349	207	5
356	208	5
363	214	5
370	221	5
377	223	5
384	228	5
391	235	5
398	238	5
526	250	5
523	253	5
521	257	5
522	263	5
535	267	5
527	272	5
537	277	5
540	285	5
546	290	5
538	294	5
534	301	5
532	302	5
531	309	5
533	313	5
539	320	5
530	323	5
524	332	5
549	340	5
536	344	5
528	348	5
525	352	5
529	357	5
541	365	5
52	1	6
57	15	6
99	17	6
55	25	6
66	28	6
62	33	6
102	38	6
98	44	6
54	47	6
60	54	6
101	60	6
53	61	6
51	70	6
56	73	6
64	76	6
50	82	6
58	90	6
65	93	6
63	99	6
100	105	6
59	107	6
49	114	6
61	119	6
239	124	6
246	132	6
253	136	6
260	141	6
267	144	6
274	152	6
283	155	6
288	162	6
295	163	6
302	169	6
309	176	6
316	181	6
323	187	6
330	189	6
337	197	6
344	201	6
351	207	6
358	208	6
365	214	6
372	221	6
379	223	6
386	228	6
393	235	6
400	238	6
419	250	6
428	253	6
405	260	6
417	263	6
421	267	6
406	272	6
422	277	6
425	285	6
426	290	6
431	295	6
420	300	6
411	302	6
410	310	6
430	313	6
423	320	6
409	330	6
427	333	6
433	340	6
432	342	6
429	348	6
418	356	6
407	357	6
424	365	6
88	1	8
92	13	8
96	18	8
127	23	8
87	27	8
132	32	8
86	38	8
129	44	8
90	46	8
97	54	8
131	56	8
126	61	8
85	70	8
91	73	8
94	77	8
84	84	8
128	87	8
89	93	8
95	100	8
130	101	8
93	106	8
83	111	8
133	119	8
241	125	8
248	129	8
255	133	8
262	138	8
269	145	8
276	149	8
281	153	8
290	162	8
297	165	8
304	171	8
311	175	8
318	178	8
325	183	8
332	188	8
339	194	8
346	199	8
353	203	8
360	208	8
367	216	8
374	220	8
381	223	8
388	228	8
395	237	8
402	238	8
471	250	8
469	253	8
472	261	8
470	263	8
465	267	8
463	272	8
453	277	8
473	285	8
464	290	8
449	292	8
456	301	8
466	302	8
452	310	8
462	313	8
461	320	8
474	330	8
454	332	8
451	340	8
450	344	8
458	348	8
455	352	8
467	361	8
468	362	8
174	1	9
180	13	9
186	20	9
178	25	9
172	27	9
189	33	9
173	38	9
185	44	9
177	47	9
191	51	9
188	59	9
176	62	9
171	70	9
179	71	9
183	80	9
169	83	9
181	90	9
175	95	9
184	100	9
187	103	9
182	108	9
81	114	9
190	120	9
508	250	9
509	253	9
500	259	9
510	263	9
512	267	9
501	272	9
492	277	9
507	285	9
513	290	9
520	294	9
518	298	9
514	302	9
506	308	9
515	313	9
494	318	9
505	323	9
516	332	9
504	338	9
519	343	9
502	348	9
517	352	9
503	357	9
511	363	9
200	1	10
211	15	10
222	17	10
208	25	10
195	27	10
227	33	10
197	39	10
220	44	10
205	47	10
232	54	10
225	57	10
204	61	10
194	70	10
209	73	10
216	80	10
193	84	10
213	90	10
202	93	10
218	99	10
224	103	10
215	107	10
192	114	10
230	120	10
240	125	10
247	128	10
254	135	10
261	142	10
268	145	10
275	151	10
280	153	10
289	162	10
296	164	10
303	171	10
310	177	10
317	182	10
324	185	10
331	189	10
338	194	10
345	199	10
352	203	10
359	208	10
366	214	10
373	222	10
380	225	10
387	228	10
394	237	10
401	241	10
238	124	12
245	129	12
252	135	12
259	139	12
266	143	12
273	148	12
282	155	12
287	162	12
294	166	12
301	169	12
308	175	12
315	178	12
322	185	12
329	189	12
336	194	12
343	200	12
350	207	12
357	208	12
364	214	12
371	221	12
378	223	12
385	228	12
392	235	12
399	238	12
559	248	12
552	253	12
542	261	12
555	265	12
561	267	12
543	272	12
563	281	12
567	285	12
558	288	12
565	295	12
560	300	12
551	302	12
550	311	12
553	313	12
564	317	12
548	330	12
554	334	12
547	338	12
562	343	12
544	348	12
556	352	12
545	357	12
566	362	12
\.


--
-- Data for Name: years_categories; Type: TABLE DATA; Schema: public; Owner: perenstrom
--

COPY public.years_categories (category_id, year_id) FROM stdin;
best-picture	2021
best-director	2021
best-adapted-screenplay	2021
best-original-screenplay	2021
best-actor	2021
best-actress	2021
best-supporting-actor	2021
best-supporting-actress	2021
best-cinematography	2021
best-editing	2021
best-sound	2021
best-costume	2021
best-hair-and-makeup	2021
best-production-design	2021
best-animated-feature	2021
best-documentary	2021
best-original-score	2021
best-original-song	2021
best-visual-effects	2021
best-international-film	2021
best-live-action-short	2021
best-animated-short	2021
best-documentary-short	2021
best-supporting-actor	2020
best-hair-and-makeup	2020
best-costume	2020
best-documentary	2020
best-sound-editing	2020
best-sound-mixing	2020
best-production-design	2020
best-international-film	2020
best-supporting-actress	2020
best-animated-short	2020
best-animated-feature	2020
best-visual-effects	2020
best-editing	2020
best-documentary-short	2020
best-live-action-short	2020
best-adapted-screenplay	2020
best-original-screenplay	2020
best-cinematography	2020
best-original-score	2020
best-original-song	2020
best-director	2020
best-actor	2020
best-actress	2020
best-picture	2020
best-picture	2022
best-adapted-screenplay	2022
best-director	2022
best-original-screenplay	2022
best-actor	2022
best-actress	2022
best-supporting-actress	2022
best-supporting-actor	2022
best-cinematography	2022
best-editing	2022
best-sound	2022
best-costume	2022
best-hair-and-makeup	2022
best-production-design	2022
best-animated-feature	2022
best-documentary	2022
best-original-score	2022
best-original-song	2022
best-visual-effects	2022
best-international-film	2022
best-live-action-short	2022
best-animated-short	2022
best-documentary-short	2022
\.


--
-- Name: bets_id_seq; Type: SEQUENCE SET; Schema: public; Owner: perenstrom
--

SELECT pg_catalog.setval('public.bets_id_seq', 568, false);


--
-- Name: groups_id_seq; Type: SEQUENCE SET; Schema: public; Owner: perenstrom
--

SELECT pg_catalog.setval('public.groups_id_seq', 5, false);


--
-- Name: nominations_id_seq; Type: SEQUENCE SET; Schema: public; Owner: perenstrom
--

SELECT pg_catalog.setval('public.nominations_id_seq', 367, false);


--
-- Name: players_id_seq; Type: SEQUENCE SET; Schema: public; Owner: perenstrom
--

SELECT pg_catalog.setval('public.players_id_seq', 13, false);


--
-- PostgreSQL database dump complete
--

