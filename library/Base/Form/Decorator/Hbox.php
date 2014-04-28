<?php
class Base_Form_Decorator_Hbox extends Base_Form_Decorator_Box
{
	protected $_class = 'hBox';

    public function render($content)
    {
        $element = $this->getElement();
        if (!$element instanceof Zend_Form_Element) {
            return $content;
        }
        if (null === $element->getView()) {
            return $content;
        }

        $separator = $this->getSeparator();
        $placement = $this->getPlacement();
        //evita duplicação de label
        if( $element instanceOf Base_Form_Element_Button ){
            $label = '';
        } else {
            $label = ($element instanceof Base_Form_Element_Label)? '' : $this->buildLabel();
        }
        $input     = $this->buildInput();
        $errors    = $this->buildErrors();
        $desc      = $this->buildDescription();
		$attr	   = $this->getAttributes();

        $output = "<div {$attr}>"
                . $label
                . $input
                . $errors
                . $desc
                . "</div>";

        switch ($placement) {
            case (self::PREPEND):
                return $output . $separator . $content;
            case (self::APPEND):
            default:
                return $content . $separator . $output;
        }
    }
}