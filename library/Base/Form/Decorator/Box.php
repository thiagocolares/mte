<?php
class Base_Form_Decorator_Box extends Zend_Form_Decorator_Abstract
{
    protected $_class = '';

	public function buildLabel()
    {
        $element = $this->getElement();
        $label = $element->getLabel();
        if ($translator = $element->getTranslator()) {
            $label = $translator->translate($label);
        }
        if($label != ""){
	        $label .= ':';
        }
        if ($element->isRequired()) {
            $element->addValidator('NotEmpty');
            $this->addClass($element,'required');
            $elementLabel = $element->getView()
                       			->formLabel($element->getFullyQualifiedName(), $label, array('class'=>'required'));
        }else{
        	$elementLabel = $element->getView()
                       ->formLabel($element->getFullyQualifiedName(), $label );
        }

        return $elementLabel;
    }

    public function buildInput()
    {
        $element = $this->getElement();
        $helper  = $element->helper;

        return $element->getView()->$helper(
            $element->getFullyQualifiedName(),
            $element->getValue(),
            $element->getAttribs(),
            $element->options
        );
    }

    public function buildErrors()
    {
        $element  = $this->getElement();
        $messages = $element->getMessages();
        if (empty($messages)) {
            return '';
        }
        return '<div class="errors">' .
               $element->getView()->formErrors($messages) . '</div>';
    }

    public function buildDescription()
    {
        $element = $this->getElement();
        $desc    = $element->getDescription();
        if (empty($desc)) {
            return '';
        }
        return '<div class="description">' . $desc . '</div>';
    }

    public function getAttributes(){
    	$options = $this->getOptions();
    	$options['class'] = (isset($options['class']))?$options['class'].' '.$this->_class : $this->_class ;
    	$attr='';
    	foreach($options as $key=>$value){
    		$attr.="{$key}=\"{$value}\"";
   		}
   		return $attr;
    }

    public function render($content)
    {
        parent::render($content);
    }

    /**
     * Método para adicionar uma classe a um elemento
     *
     * @param Zend_Form_Element $element
     * @param string $class
     * @return Base_Form_Decorator_Box
     */
    public function addClass( Zend_Form_Element $element,$class)
    {
        $this->removeClass($element,$class);
        $classOld = ( !is_null($element->getAttrib('class')) )? $element->getAttrib('class').' ' : '';
        $element->setAttrib("class", "{$classOld}$class");
        return $this;
    }

    /**
     * Método para remover uma classe de um elemento
     *
     * @param Zend_Form_Element $element
     * @param string $class
     * @return Base_Form_Decorator_Box
     */
    public function removeClass( Zend_Form_Element $element,$class)
    {
        if( !is_null($element->getAttrib('class')) ){
            $classNew = '';
            $classOld = $element->getAttrib('class');
            $classExplode = explode( ' ', $classOld );
            foreach( $classExplode as $key=>$value ){
                if( $value === $class ){ unset($classExplode[$key]); }
            }
            $classNew = implode(' ',$classExplode);
            $element->setAttrib("class", $classNew);
        }
        return $this;
    }

}