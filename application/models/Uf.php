<?php

class Uf extends Base_Db_Table {

    protected $_name = "uf";
    protected $_primary = "codigo_uf";

    public function getAll() {

        $db = $this->getAdapter();

        $select = "SELECT * from uf";
        $rs = $db->fetchAll($select);
        return $rs;
    }

}
