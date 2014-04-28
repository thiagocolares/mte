<?php
class Base_Application_Resource_Dbs extends Zend_Application_Resource_ResourceAbstract
 {
     /**
      * @var array
      */
     protected $_dbs = array();
     protected function _getDbs()
     {
         $options = $this->getOptions();

         foreach ($options as $name => $opt) {
             $adapter = $opt['adapter'];
             $params = $opt['params'];
             $isDefaultTableAdapter = $opt['isDefaultTableAdapter'];
             $getConnection = $opt['getConnection'];
             $profilerEnabled = (isset($opt['profilerEnabled']))?$opt['profilerEnabled']:false;
             $db = Zend_Db::factory($adapter, $params);
             if ($getConnection) {
                 try {
                     $db->getConnection();
                 } catch (Exception $e) {
                     throw new Base_Application_Resource_Dbs_Exception(
                             "Could not connect to database: {$e->getMessage()}");
                 }
             }
             if ($isDefaultTableAdapter) {
                 Zend_Db_Table::setDefaultAdapter($db);
              }
            $profiler = new Zend_Db_Profiler_Firebug('All DB Queries');
            $profiler->setEnabled($profilerEnabled);
            $db->setProfiler($profiler);
              
              
             $this->_dbs[$name] = $db;
         }
         $registry = Zend_Registry::getInstance();
         $registry->set('dbs',$this->_dbs);
         return $this->_dbs;
     }
     /**
      * Defined by Zend_Application_Resource_Resource
      *
      * @return array|null
      */
     public function init()
     {
         if (null !== ($dbs = $this->_getDbs())) {
             return $dbs;
         }
     }
 }