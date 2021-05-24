CREATE OR REPLACE PACKAGE PKG_FCA_ATLAS AS
	--Retourne la liste des formes riches "précises" (gps) au format JSON
    FUNCTION formesRichesPrecises2JSON (
        p_entetepk NUMBER
    ) RETURN CLOB;

	--Retourne la liste des formes riches non-précises (gps), par canton, au format JSON
    FUNCTION formesRichesVagues2JSON (
        p_entetepk NUMBER
    ) RETURN CLOB;

END PKG_FCA_ATLAS;

/

CREATE OR REPLACE PACKAGE BODY PKG_FCA_ATLAS AS

    FUNCTION formesRichesPrecises2JSON (
        p_entetepk NUMBER
    ) RETURN CLOB IS
        l_cursor   SYS_REFCURSOR;
        l_formesJSON    CLOB;
    BEGIN
        OPEN l_cursor FOR 
            select distinct '<span class="'||f.cssclasseforme||'">'|| FORMETYPOGRAPHIE ||'</span>' as formeriche, FormeLangueLibelle as langue,l.lienprog as lienproglangue, l.libelle ||' ('||l.code||')' as localisation, l.latitude,l.longitude 
			FROM V_WEB_FORMES_LIS f
			INNER JOIN formerefs fref ON f.pkforme=fref.num_formes
			INNER JOIN localisations l ON l.numero=fref.num_localisations
			INNER JOIN type_localisations tl on tl.numero=l.num_type_loc
			INNER JOIN langues l on l.numero=f.num_langues
			where num_entetes=p_entetepk and tl.abreviation IN ('C','H');

        apex_json.initialize_clob_output;
        apex_json.open_object;
        --Markers est l'élément racine du fichier JSON.
        apex_json.write('lesformes', l_cursor);
        apex_json.close_object;
        l_formesJSON := apex_json.get_clob_output;
        RETURN l_formesJSON;
    END;

		FUNCTION formesRichesVagues2JSON (
			p_entetepk NUMBER
		) RETURN CLOB IS
			
			l_cursorFormes SYS_REFCURSOR;
			CURSOR l_cursorCanton IS
					select l.numero as numero,l.code as code,latitude, longitude from localisations l INNER JOIN type_localisations tyl ON l.num_type_loc=tyl.numero 
					where tyl.letype='canton' and l.latitude IS NOT NULL and l.longitude IS NOT NULL;
			l_formesJSON    CLOB;
		BEGIN
			
			
			apex_json.initialize_clob_output;
			apex_json.open_object;
			apex_json.open_array('cantons');
			FOR canton IN l_cursorCanton LOOP
				apex_json.open_object;
				apex_json.write('CODE',canton.code);
				apex_json.write('LATITUDE',canton.latitude);
				apex_json.write('LONGITUDE',canton.longitude);
				
				OPEN l_cursorFormes FOR select distinct '<span class="'||f.cssclasseforme||'">'|| FORMETYPOGRAPHIE ||'</span>' as formeriche, f.formeduplappauvrie as formeduplappauvrie,f.dupltransriche as dupltransriche, FormeLangueLibelle as langue,l.lienprog as lienproglangue, l.libelle ||' ('||l.code||')' as localisation 
				FROM V_WEB_FORMES_LIS f
				INNER JOIN formerefs fref ON f.pkforme=fref.num_formes
				INNER JOIN localisations l ON l.numero=fref.num_localisations
				INNER JOIN type_localisations tl on tl.numero=l.num_type_loc
				INNER JOIN langues l on l.numero=f.num_langues
				INNER JOIN locarbreplat arbre ON arbre.numlocalisation=l.numero
				INNER JOIN localisations locCanton ON locCanton.numero=arbre.numestinclusdans
				INNER JOIN type_localisations typeCanton ON typeCanton.numero=locCanton.num_type_loc
				where num_entetes=p_entetepk and loccanton.numero=canton.numero and tl.abreviation NOT IN ('C','H') 
				ORDER BY
                    FormeDuplAppauvrie,
                    nlssort(DuplTransRiche,'NLS_SORT=binary');
				
				
				
				apex_json.write('lesformes',l_cursorFormes);
				apex_json.close_object;
			END LOOP;
			
			
			apex_json.close_all;
			l_formesJSON := apex_json.get_clob_output;
			RETURN l_formesJSON;
		END;


END PKG_FCA_ATLAS;
