<?php

class AnexoUmGrte extends Base_Db_Table {

    protected $_name = "questionario_grte_anx01";
    protected $_primary = "id_questionario_grte_anx01";

    public function getGrid($idQuestGrte) {

        if ($idQuestGrte) {
            $db = $this->getAdapter();

            $select = "SELECT * from questionario_grte_anx01 WHERE id_questionario_grte = {$idQuestGrte}";

            $rs = $db->fetchAll($select);

            return $rs;
        } else {
            return array();
        }
    }

    public function salvar($arrDados = array()) {

        if (!isset($arrDados['id_questionario_grte_anx01'])) {
            //Anexo novo
            $arrDados['id_questionario_grte_anx01'] = $this->insert($arrDados);
        } else {
            //Anexo já existente
            $this->update($arrDados, "id_questionario_grte_anx01 = {$arrDados['id_questionario_grte_anx01']}");
        }

        return $arrDados['id_questionario_grte_anx01'];
    }

    public function getAnexoUm($idQuestionarioGrteAnx01) {

        if ($idQuestionarioGrteAnx01) {
            $db = $this->getAdapter();

            $select = "SELECT * from questionario_grte_anx01 WHERE id_questionario_grte_anx01 = {$idQuestionarioGrteAnx01}";

            $rs = $db->fetchAll($select);

            return $rs;
        } else {
            return array();
        }
    }

}
