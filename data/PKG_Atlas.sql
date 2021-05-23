CREATE OR REPLACE PACKAGE PKG_FCA_ATLAS AS
	--Retourne la liste des formes riches "précises" (gps) au format JSON
    FUNCTION formesRichesPrecises2JSON (
        p_entetepk NUMBER
    ) RETURN CLOB;

END PKG_FCA_ATLAS;

/

CREATE OR REPLACE PACKAGE BODY PKG_FCA_ATLAS AS

    FUNCTION formesRichesPrecises2JSON (
        p_entetepk NUMBER
    ) RETURN CLOB IS
        l_cursor   SYS_REFCURSOR;
        l_atlas    CLOB;
    BEGIN
        OPEN l_cursor FOR 
            select distinct '<p class="'||f.cssclasseforme||'">'|| FORMETYPOGRAPHIE ||'</p>' as formeriche, FormeLangueLibelle as langue, l.libelle ||' ('||l.code||')' as localisation, l.latitude,l.longitude 
			FROM V_WEB_FORMES_LIS f
			INNER JOIN formerefs fref ON f.pkforme=fref.num_formes
			INNER JOIN localisations l ON l.numero=fref.num_localisations
			INNER JOIN type_localisations tl on tl.numero=l.num_type_loc
			where num_entetes=p_entetepk and tl.abreviation IN ('C','H');

        apex_json.initialize_clob_output;
        apex_json.open_object;
        --Markers est l'élément racine du fichier JSON.
        apex_json.write('lesformes', l_cursor);
        apex_json.close_object;
        l_atlas := apex_json.get_clob_output;
        RETURN l_atlas;
    END;

END PKG_FCA_ATLAS;
