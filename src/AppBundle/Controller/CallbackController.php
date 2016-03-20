<?php

namespace AppBundle\Controller;

use PHPInsight\Sentiment;
use Pusher;
use SimpleXMLElement;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\File\Exception\AccessDeniedException;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpKernel\Exception\AccessDeniedHttpException;
use Symfony\Component\Routing\Annotation\Route;

class CallbackController extends Controller
{

    /**
     * @Route("/callback/pug-bomb", name="callback_pugbomb")
     * @param Request $request
     *
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function pugBomb(Request $request)
    {
        $pusher = $this->getPusher();

        $pusher->trigger('test_channel', 'pug-bomb', ['message' => 'ALL THE PUGS']);

        return $this->render(':callback:esendex.html.twig');
    }

    /**
     * @Route("/callback/esendex/{id}", name="callback_esendex")
     * @param Request $request
     *
     * @param         $id
     *
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function esendex(Request $request, $id)
    {
        $this->checkAccess($id);

        $parsedData = $this->parseContent($request->getContent());

        $pusher = $this->getPusher();

        $messageText = strtolower($parsedData['MessageText']);
        $sentiment = new Sentiment();
        $class = $sentiment->categorise($messageText);

        $pusher->trigger('test_channel', 'fuck-shit-up', ['sentiment' => $class, 'message' => $messageText]);

        return $this->render(':callback:esendex.html.twig');
    }

    /**
     * @Route("/callback/fuck-shit-up", name="callback_fuckshitup")
     * @param Request $request
     *
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function fuckShitUp(Request $request)
    {
        $pusher = $this->getPusher();

        $pusher->trigger(
            'test_channel',
            'fuck-shit-up',
            ['sentiment' => 'neg', 'message' => 'SHIT GOT FUCKED UP FOR REAL YO']
        );

        return $this->render(':callback:esendex.html.twig');
    }

    /**
     * @param $id
     */
    private function checkAccess($id)
    {
        if ($id != $this->getParameter('callback_esendex_id')) {
            throw new AccessDeniedHttpException;
        }
    }

    private function parseContent($content)
    {
        $xml = simplexml_load_string($content, "SimpleXMLElement", LIBXML_NOCDATA);
        $json = json_encode($xml);

        return json_decode($json, true);
    }

    /**
     * @return Pusher
     */
    protected function getPusher()
    {
        $options = array(
            'cluster' => 'eu',
            'encrypted' => true
        );
        $pusher = new Pusher(
            $this->getParameter('pusher_app_key'),
            $this->getParameter('pusher_app_secret'),
            $this->getParameter('pusher_app_id'),
            $options
        );

        return $pusher;
    }
}