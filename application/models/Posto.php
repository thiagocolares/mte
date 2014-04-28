<?php

class Posto extends Base_Db_Table {

    protected $_name = "posto";
    protected $_primary = "codigo_posto";

    public function getPosto($idPosto, $tipo) {

        if ($idPosto) {
            
            $db = $this->getAdapter();

            $select = "SELECT * from posto WHERE codigo_posto = '{$idPosto}' AND tipo_posto = '{$tipo}'";
            $rs = $db->fetchAll($select);
            
            if($rs) {
                return $rs[0];
            } else {
                return null;
            }
            
            
            
        } else {
            return array();
        }
    }

}
