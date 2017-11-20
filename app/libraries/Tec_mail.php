<?php defined('BASEPATH') OR exit('No direct script access allowed');
/*
*  ==============================================================================
*  Author   : Mian Saleem
*  Email    : saleem@tecdiary.com
*  Web      : http://tecdiary.com
*  ==============================================================================
*/

require APPPATH . 'third_party/PHPMailer/PHPMailerAutoload.php';

class Tec_mail
{

    public function __construct() {

    }

    public function __get($var) {
        return get_instance()->$var;
    }

    public function sendMail($UserName,$Password,$ToEmail,$ToName,$Title)
    {

        $mail = new PHPMailer();
        //$UserName='erp@shafco.co';
        //$Password='5b5e0cf7b9';


        $mail->IsSMTP(); // set mailer to use SMTP


        $mail->Host = "ssl://smtp.gmail.com";
        $mail->Port = 465;                    // set the SMTP port for the GMAIL server
        $mail->SMTPAuth = true;     // turn on SMTP authentication
        $mail->Username = $UserName;  // SMTP username
        $mail->Password = $Password; // SMTP password


        $mail->From = $UserName;
        $mail->FromName = "POS System";
        $mail->AddAddress($ToEmail, $ToName);





        $mail->WordWrap = 50;                                 // set word wrap to 50 characters
       // foreach($Attachment AS $x=>$value){
        ////    $mail->AddAttachment($Attachment[$x]);
     //   }
        //$mail->AddAttachment("/var/tmp/file.tar.gz");         // add attachments
        //$mail->AddAttachment("/tmp/image.jpg", "new.jpg");    // optional name
        $mail->IsHTML(true);                                  // set email format to HTML

        $mail->Subject = $Title;
        $Body="<H1>Tes</H1>";
        $Body.="<br /><b>Email Ini Dikirim Oleh Sistem ERP. Anda Tidak Perlu Membalas Email Ini</b>";
        $mail->Body=$Body;

        if (!$mail->send()) {
            throw new Exception($mail->ErrorInfo);
            return $mail->ErrorInfo;
        }
        return 'true';
    }

    public function send_mail($to, $subject, $body, $from = NULL, $from_name = NULL, $attachment = NULL, $cc = NULL, $bcc = NULL) {

        try {
            $mail = new PHPMailer;
            $mail->isSMTP();
            // $mail->SMTPDebug = 4;
            $mail->Host = "ssl://smtp.gmail.com";//$this->Settings->smtp_host;
            $mail->SMTPAuth = true;
            $mail->Username = 'erp2@shafco.com';//$this->Settings->smtp_user;
            $mail->Password ='syst3m.Pr0c3dur3';// $this->Settings->smtp_pass;
           // $mail->SMTPSecure = !empty($this->Settings->smtp_crypto) ? $this->Settings->smtp_crypto : false;
            $mail->Port = 25;//$this->Settings->smtp_port;

            if ($from && $from_name) {
                $mail->setFrom($from, $from_name);
                $mail->setaddReplyToFrom($from, $from_name);
            } elseif ($from) {
                $mail->setFrom($from, $this->Settings->site_name);
                $mail->addReplyTo($from, $this->Settings->site_name);
            } else {
                $mail->setFrom($this->Settings->default_email, $this->Settings->site_name);
                $mail->addReplyTo($this->Settings->default_email, $this->Settings->site_name);
            }

            $mail->addAddress($to);
            if ($cc) { $mail->addCC($cc); }
            if ($bcc) { $mail->addBCC($bcc); }
            $mail->Subject = $subject;
            $mail->isHTML(true);
            $mail->Body = $body;
            if ($attachment) {
                if (is_array($attachment)) {
                    foreach ($attachment as $attach) {
                        $mail->addAttachment($attach);
                    }
                } else {
                    $mail->addAttachment($attachment);
                }
            }

            if (!$mail->send()) {
                throw new Exception($mail->ErrorInfo);
                return FALSE;
            }
            return TRUE;
        } catch (phpmailerException $e) {
            throw new Exception($e->errorMessage());
        } catch (Exception $e) {
            throw new Exception($e->getMessage());
        }
    }

}
